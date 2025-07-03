import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  BadRequestException,
  NotFoundException,
} from "@nestjs/common";
import * as crypto from "crypto";
import { compare, hash } from "bcrypt";
import { Redis } from "ioredis";
import { EmailService } from "src/email/email.service";
import { UsersService } from "src/users/users.service";
import { getVerifyOtpTemplate } from "src/email/templates/get-verify-otp.template";

@Injectable()
export class OtpService {
  constructor(
    @Inject('REDIS_CLIENT') private readonly redisClient: Redis,
    private userService: UsersService,
    private readonly emailService: EmailService,
  ) {}

  private readonly OTP_EXPIRATION_TIME = 5 * 60; // 5 minutes
  private readonly MAX_RETRY_COUNT = 5;
  private readonly SHORT_COOLDOWN_TIME = 60;   // 1 minute
  private readonly LONG_COOLDOWN_TIME = 3600;  // 1 hour

  private getRandomSixDigit() {
    return crypto.randomInt(100000, 1000000).toString();
  }

  private async storeOtp(email: string, hashedOtp: string) {
    await this.redisClient.set(`otp:${email}`, hashedOtp, 'EX', this.OTP_EXPIRATION_TIME);
    await this.redisClient.set(`otp_retry:${email}`, '0', 'EX', this.OTP_EXPIRATION_TIME);
  }

  private async applyCooldown(email: string, seconds: number) {
    const until = Math.floor(Date.now() / 1000) + seconds;
    await this.redisClient.set(`otp_cooldown:${email}`, until.toString(), 'EX', seconds);
  }

  private async assertNotOnCooldown(email: string) {
    const ts = await this.redisClient.get(`otp_cooldown:${email}`);
    if (!ts) return;
    const now = Math.floor(Date.now() / 1000);
    if (now < Number(ts)) {
      const secsLeft = Number(ts) - now;
      throw new BadRequestException(
        `Please wait ${Math.floor(secsLeft / 60)}m ${secsLeft % 60}s before requesting a new OTP`
      );
    }
  }

  async requestOTP(email: string, name = 'User'): Promise<string> {
    await this.assertNotOnCooldown(email);

    const otp = this.getRandomSixDigit();
    const hashed = await hash(otp, 10);

    await this.storeOtp(email, hashed);
    await this.applyCooldown(email, this.SHORT_COOLDOWN_TIME);

    const html = getVerifyOtpTemplate(otp, name);
    await this.emailService.sendMail(email, 'Verify your email', html);
    return otp;
}

  async verifyOtp(email: string, otp: string): Promise<boolean> {
    const stored = await this.redisClient.get(`otp:${email}`);
    if (!stored) {
      throw new NotFoundException('OTP expired or not found');
    }

    const retryKey = `otp_retry:${email}`;
    const retries = Number(await this.redisClient.get(retryKey)) || 0;
    if (retries >= this.MAX_RETRY_COUNT) {
      await this.applyCooldown(email, this.LONG_COOLDOWN_TIME);
      throw new BadRequestException('Too many failed attempts, please try again later');
    }

    const ok = await compare(otp, stored);
    if (!ok) {
      await this.redisClient.incr(retryKey);
      throw new BadRequestException(`Invalid OTP. You have ${this.MAX_RETRY_COUNT - retries - 1} attempts left.`);
    }

    await Promise.all([
      this.redisClient.del(`otp:${email}`),
      this.redisClient.del(retryKey),
      this.redisClient.del(`otp_cooldown:${email}`),
    ]);

    return true;
  }
}
