import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './modules/app/app.module';
import InitFirebase from './services/firebase';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.enableCors();

  InitFirebase();

  const port = process.env.API_PORT || 8194;
  await app.listen(port);
  Logger.log(`🚀 Application is running on: ${port} `);
}

bootstrap();
