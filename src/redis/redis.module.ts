import {Module, DynamicModule} from '@nestjs/common';
import {ConfigService} from '@nestjs/config';
import Redis from 'ioredis';


@Module({})
export class RedisModule {
    static forRootAsync(): DynamicModule {
        return {
            module: RedisModule,
            providers: [
                {
                    inject: [ConfigService],
                    provide: 'REDIS_CLIENT',
                    useFactory: async (configService: ConfigService) => {
                        const redisUrl = configService.get<string>('REDIS_URL');
                        if (!redisUrl) {
                            throw new Error('REDIS_URL is not defined in the configuration');
                        }
                        const redisClient = new Redis(redisUrl);

                        redisClient.on('error', (err) => {
                            console.error('Redis Client Error', err);
                        });

                        return redisClient;
                    },
                },
            ],
            exports: ['REDIS_CLIENT'],
        };
    }
}