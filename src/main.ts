import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);



  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    })
  )
  console.log(`server port is: ${process.env.SERVER_PORT}`)
  await app.listen(process.env.SERVER_PORT ?? 3000);
}
bootstrap();
