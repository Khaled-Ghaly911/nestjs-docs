import { registerAs } from "@nestjs/config";

export interface DatabaseConfig {
  type:     'postgres' | 'mysql';
  host:     string;
  port:     number;
  username: string;
  password: string;
  database: string;
  synchronize?: boolean;
}

export default registerAs('database', (): DatabaseConfig => ({
  type:        (process.env.DB_TYPE    as DatabaseConfig['type']) ?? 'postgres',
  host:        process.env.DB_HOST     ?? 'localhost',
  port:        parseInt(process.env.DB_PORT  ?? '5432', 10),
  username:    process.env.DB_USERNAME ?? 'postgres',
  password:    process.env.DB_PASSWORD ?? 'sdfsdf',
  database:    process.env.DB_NAME     ?? 'mydb',
  synchronize: true,
}));
