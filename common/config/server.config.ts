import { registerAs } from '@nestjs/config';

export interface ServerConfig {
  port: number;
  env: string;
}

export default registerAs('server', (): ServerConfig => ({
  port: parseInt(process.env.SERVER_PORT ?? '3000', 10),
  env: process.env.NODE_ENV ?? 'development',
}));
