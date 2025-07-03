import { Global, Module, NotFoundException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersModule } from 'src/users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { OtpModule } from 'src/otp/otp.module';
import { AuthResolver } from './auth.resolver';

@Global() 
@Module({
  imports: [
    UsersModule,
    OtpModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (conf: ConfigService) => {
        const accessJwt = conf.get<string>('jwt.access_key')
        
        if(!accessJwt) {
          throw new NotFoundException("Jwt access key not found!")
        }

        return {
          secret: accessJwt,
          signOptions: { expiresIn: '2d'}
        }
      },
      global: true,
    })
  ],
  providers: [AuthService, AuthResolver],
  exports: [AuthService, JwtModule]
})
export class AuthModule {}
