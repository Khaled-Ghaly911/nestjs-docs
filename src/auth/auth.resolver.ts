import { Mutation, Resolver, Query, Args } from '@nestjs/graphql';
import { AuthResponse } from './dtos/auth.response';
import { AuthService } from './auth.service';
import { SignupDto } from './dtos/sign-up.dto';
import { VerifyUserDto } from './dtos/verify-user.dto';
import { RequestOtpDto } from './dtos/request-otp.dto';
import { ResetPasswordDto } from './dtos/reset-password.dto';
import { SignInDto } from './dtos/sign-in.dto';
import { User } from 'src/users/user.entity';
import { GetUser } from './decorators/current-user.decorator';
import { JwtPayload } from 'common/interfaces/jwt-payload.interface';

@Resolver(() => AuthResponse)
export class AuthResolver {
    constructor(
        private readonly authService: AuthService,
    ) {}

    @Mutation(() => AuthResponse)
    async signUp(@Args('signupDto') signUpDto: SignupDto): Promise<AuthResponse> {
        return await this.authService.signUp(signUpDto);
    }

    @Mutation(() => Boolean)
    async verifyEmail(@Args('verifiyEmailDto') verifiyEmailDto: VerifyUserDto): Promise<boolean> {
        return await this.authService.verifyUser(verifiyEmailDto);
    }

    @Query(() => String)
    async requestOtp(@Args('requestOtpDto') requestOtpDto: RequestOtpDto): Promise<string>{
        return await this.authService.requestOtp(requestOtpDto);
    }

    @Mutation(() => AuthResponse)
    async signIn(@Args('signInDto') signInDto: SignInDto): Promise<AuthResponse> {
        return this.authService.signIn(signInDto);
    }

    @Mutation(() => String)
    async forgotPassword(@Args('email') email: string): Promise<string> {
        return await this.authService.forgotPassword(email);
    }

    @Mutation(() => Boolean) 
    async resetPassword(@Args('resetPasswordDto') resetPasswordDto: ResetPasswordDto) {
        return await this.authService.resetPassword(resetPasswordDto)
    }

    @Query(() => User)
    async me(@GetUser() payLoad: JwtPayload): Promise<User> {
        return this.authService.me(payLoad.userId);
    }
}
