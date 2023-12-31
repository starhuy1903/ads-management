import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app/app.module';
import InitFirebase from './services/firebase';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Multer } from 'multer'; // cheating type, dont delete

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  );
  app.setGlobalPrefix('api');
  app.enableCors();

  InitFirebase();

  const port = process.env.API_PORT || 8194;
  await app.listen(port);
  Logger.log(`🚀 Application is running on port: ${port} `);
}

bootstrap();
