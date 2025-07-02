import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriverConfig, ApolloDriver } from "@nestjs/apollo";
import { ApolloServerPluginUsageReporting } from '@apollo/server/plugin/usageReporting';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { User } from './users/user.entity';
import databaseConfig, { DatabaseConfig } from './common/config/database.config';
import serverConfig from './common/config/server.config'
import * as joi from 'joi';

@Module({
  imports: [
    AuthModule, 
    UsersModule,
    ConfigModule.forRoot({
        envFilePath: '.development.env',
        isGlobal: true,
        load: [databaseConfig, serverConfig],
        validationSchema: joi.object({
          DB_HOST: joi.string(),
          DB_PORT: joi.number().port().default(5432),
          DB_PASSWORD: joi.string(),
          DB_NAME: joi.string(),
          DB_USERNAME: joi.string(),
          DB_TYPE: joi.string(),
          SERVER_PORT: joi.number().port().default(3000),
          NODE_ENV: joi.string()
        }),
        validationOptions: {
          allowUnknown: true,
          abortEarly: true
        }
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (cfg: ConfigService): TypeOrmModuleOptions => {
        const db = cfg.get<DatabaseConfig>('database');
        if (!db) {
          throw new Error('Database configuration not found');
        }
        return {
          type:        db.type,
          host:        db.host,
          port:        db.port,
          username:    db.username,
          password:    db.password,
          database:    db.database,
          entities:    [User],
          synchronize: db.synchronize,
          logging:      true,
        };
      },
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
      playground: false,
      introspection: true,
      plugins: [
        // ApolloServerPluginUsageReporting(),
        ApolloServerPluginLandingPageLocalDefault({ embed: true })
      ],
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
