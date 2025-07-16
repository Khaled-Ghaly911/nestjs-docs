import { Module, NotFoundException } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriverConfig, ApolloDriver } from "@nestjs/apollo";
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { User } from './users/user.entity';
import databaseConfig, { DatabaseConfig } from 'common/config/database.config';
import serverConfig from 'common/config/server.config'; 
import * as joi from 'joi';
import { JwtModule } from '@nestjs/jwt';
import { RedisModule } from './redis/redis.module';
import { ChatModule } from './chat/chat.module';
import { GalleryModule } from './gallery/gallery.module';
import jwtConfig from 'common/config/jwt.config';
import * as jwt from 'jsonwebtoken';
import { Gallery } from './gallery/entities/gallery.entity';
import { Message } from './chat/entities/message.entity';
import { Chat } from './chat/entities/chat.entity';


@Module({
  imports: [
    AuthModule, 
    UsersModule,
    ConfigModule.forRoot({
        envFilePath: '.development.env',
        isGlobal: true,
        load: [databaseConfig, serverConfig, jwtConfig],
        validationSchema: joi.object({
          DB_HOST: joi.string(),
          DB_PORT: joi.number().port().default(5432),
          DB_PASSWORD: joi.string(),
          DB_NAME: joi.string(),
          DB_USERNAME: joi.string(),
          DB_TYPE: joi.string(),
          SERVER_PORT: joi.number().port().default(3000),
          NODE_ENV: joi.string(),
          JWT_ACCESS_KEY: joi.string(),
          JWT_REFRESH_KEY: joi.string()
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
          entities:    [User, Chat, Gallery, Message],
          synchronize: db.synchronize,
          logging:      true,
        };
      },
    }),
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
    driver: ApolloDriver,
    imports: [ConfigModule],
    inject: [ConfigService],
    useFactory: async (configService: ConfigService): Promise<ApolloDriverConfig> => ({
      autoSchemaFile: true,
      playground: false,
      introspection: true,
      plugins: [
        ApolloServerPluginLandingPageLocalDefault({ embed: true }),
      ],
      context: ({ req }) => {
        const header = req.headers['authentication'];

        if (typeof header === 'string' && header.startsWith('Bearer ')) {
          const token = header.split(' ')[1];
          const access_key = configService.get<string>('jwt.access_key');
          if(!access_key) {
            throw new NotFoundException("the access key not found");
          }
          try {
            const decoded = jwt.verify(
              token,
              access_key,
            );
            req.user = decoded;
          } catch (err) {
            req.user = null;
          }
        } else {
          req.user = null;
        }

        return { req };
      },
    }),
  }),
    RedisModule,
    ChatModule,
    GalleryModule,
  ],
  controllers: [AppController],
  providers: [AppService, JwtModule],
})
export class AppModule {}
