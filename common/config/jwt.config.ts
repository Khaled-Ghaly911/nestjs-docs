import { registerAs } from "@nestjs/config";

export interface JwtConfig {
    access_key: string;
    refresh_key: string;
}

export default registerAs('jwt', (): JwtConfig => ({
    access_key: process.env.JWT_ACCESS_KEY!,
    refresh_key: process.env.JWT_REFRESH_KEY!
}));
