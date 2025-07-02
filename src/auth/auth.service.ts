import { Injectable } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
        private readonly jwtservice: JwtService,
    ) {}

    async signUp() {

    }
}
