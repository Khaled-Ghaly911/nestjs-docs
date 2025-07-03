import { RedisModule } from 'src/redis/redis.module';
import { EmailModule } from 'src/email/email.module';
import { Module } from '@nestjs/common';
import { OtpService } from './otp.service';
import { UsersModule } from 'src/users/users.module';

@Module({
    imports: [
        RedisModule.forRootAsync(),
        EmailModule,
        UsersModule
    ],
    exports: [OtpService],
    providers: [OtpService],
})
export class OtpModule { }