import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { config } from 'process';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);



  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    })
  )

  const configService = app.get(ConfigService);

  const port = configService.get<number>('server.port');
  const env = configService.get<string>('server.env');

  
  console.log(`Running in ${env} mode on port ${port}`);
  await app.listen(process.env.SERVER_PORT ?? 3000);
}
bootstrap();

// console.log('================= CONFIG VALUES =================');
// console.log(`🌍 Environment       : ${env}`);
// console.log(`🚀 Server Port       : ${port}`);
// console.log(`🗄️  Database Host     : ${host}`);
// console.log(`🔌 Database Port     : ${db_port}`);
// console.log(`👤 DB Username       : ${username}`);
// console.log(`🔑 DB Password       : ${password}`);
// console.log(`📦 DB Name           : ${db_name}`);
// console.log('=================================================');