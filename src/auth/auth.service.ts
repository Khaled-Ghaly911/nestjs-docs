import { ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { SignupDto } from './dtos/sign-up.dto';
import { AuthResponse } from './dtos/auth.response';
import { VerifyUserDto } from './dtos/verify-user.dto';
import { RequestOtpDto } from './dtos/request-otp.dto';
import { SignInDto } from './dtos/sign-in.dto';
import { VerifyOtpDto } from './dtos/verify-otp.dto';
import { ResetPasswordDto } from './dtos/reset-password.dto';
import * as bcrypt from 'bcrypt';
import { User } from 'src/users/user.entity';
import { OtpService } from 'src/otp/otp.service';
import { ConfigService } from '@nestjs/config';
import { Role } from 'src/users/enum/role.enum';

@Injectable()
export class AuthService {
    private readonly salt_rounds = 10;

    constructor(
        private readonly usersService: UsersService,
        private readonly jwtservice: JwtService,
        private configService: ConfigService,
        private readonly otpService: OtpService
    ) {}

    private getAuthResponse(userId: string, role: Role, user: User): AuthResponse {
        const access_key = this.configService.get<string>('jwt.access_key');
        const refresh_key = this.configService.get<string>('jwt.refresh_key');
        console.log(`the access key is loaded: ${access_key}`);
        console.log(`the refresh key is loaded: ${refresh_key}`);

        const payload = {
            userId: userId,
            role
        }

        const access_token = this.jwtservice.sign(payload, { secret: access_key, expiresIn: '2d' });
        const refresh_token = this.jwtservice.sign(payload, { secret: refresh_key, expiresIn: '30d'});
        
        return { access_token, refresh_token, user };
    }

    async signUp(signUpDto: SignupDto): Promise<AuthResponse> {
        //To-Do: is the email is used?
        const usedEmail = await this.usersService.findByEmail(signUpDto.email);
        
        if(usedEmail) {
            throw new ConflictException('Email is already in use');
        }
        //TO-Do: hash the password.
        const hashedPassword = await bcrypt.hash(signUpDto.password, this.salt_rounds);
        signUpDto.password = hashedPassword;
        //TO-DO: create the user
        const user: User = await this.usersService.create(signUpDto);
        //TO-DO: send Otp 
        await this.otpService.requestOTP(signUpDto.email, signUpDto.firstName);
        //TO-DO: Generate access token and refresh token 
        return this.getAuthResponse(user.id, user.role, user);
    }

    async verifyUser(verifyUserDto: VerifyUserDto): Promise<boolean> {
        //TO-DO: get user first, check if exists;
        const user: User | null = await this.usersService.findByEmail(verifyUserDto.email);

        if(!user) {
            throw new NotFoundException("User's not found");
        }
        
        //TO-DO: Check otp
        const isOk: boolean = await this.otpService.verifyOtp(verifyUserDto.email,verifyUserDto.otp);
        if(!isOk) {
            throw new Error("OTP is Wrong");
        }
        //TO-DO: change the the verified boolean 
        user.isVerified = true;
        const updatedUser: User = await this.usersService.update(user.id, user);

        //TO-DO: if updated return true otherwise false
        if(updatedUser.isVerified === true) {
            return true 
        } else {
            throw new Error("verification failed");
        }
    }

    async requestOtp(requestOtpDto: RequestOtpDto): Promise<string> {
        //TO-DO: request otp from otp service
        const otp = await this.otpService.requestOTP(requestOtpDto.email, requestOtpDto.name)
        return otp;
    }

    async verifyOtp(verifyOtpDto: VerifyOtpDto): Promise<boolean> {
        //TO-DO: verify the otp using otp service 
        const isOk: boolean = await this.otpService.verifyOtp(verifyOtpDto.email,verifyOtpDto.otp);
        return isOk;
    }

    async signIn(signInDto: SignInDto): Promise<AuthResponse>{
        //TO-DO: get the user.
        const user: User | null = await this.usersService.findByEmail(signInDto.email);
        
        if(!user) {
            throw new NotFoundException("User's not found");
        }
        if (!user.isVerified) {
            throw new UnauthorizedException('Please verify your email before logging in.');
        }

        //TO-DO: verify the creditentials
        const isOk: boolean = await bcrypt.compare(signInDto.password,user.password);
        if(!isOk) {
            throw new UnauthorizedException("Invalid credentials!")
        }
        //TO-DO: return the response 
        return this.getAuthResponse(user.id, user.role, user);
    }


    async forgotPassword(email: string): Promise<string> {
        //TO-DO: request otp from otp service 
        const otp: string = await this.otpService.requestOTP(email);
        return otp;
    }

    //input: email, newPasswor, otp
    async resetPassword(resetPasswordDto: ResetPasswordDto): Promise<boolean> {
        //TO-DO: check user existence 
        const user: User | null = await this.usersService.findByEmail(resetPasswordDto.email);

        if(!user) {
            throw new NotFoundException("Uer not found");
        }
        //TO-DO: verifiy otp 
        const isOk: boolean = await this.otpService.verifyOtp(resetPasswordDto.email, resetPasswordDto.otp);
        //TO-DO: change to the new password and update the user
        const hashedPassword = await bcrypt.hash(resetPasswordDto.newPassword, this.salt_rounds);

        user.password = hashedPassword;

        const updatedUser = await this.usersService.update(user.id, user);
        //TO-DO: return true if it is right 
        if(updatedUser) {
            return true;
        } else {
            return false;
        }
    }

    async me(userId: string): Promise<User> {
        const user: User | null = await this.usersService.findById(userId);

        if(!user) {
            throw new NotFoundException("User not found");
        }

        return user;
    }
}
