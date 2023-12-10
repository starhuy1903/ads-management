import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
// import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // const config = app.get(ConfigService);
  const globalPrefix = 'api';

  // Allow all domains
  app.enableCors({
    origin: '*',
    credentials: true,
  });
  app.setGlobalPrefix(globalPrefix);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );

  // const port = config.get('PORT');
  const port = process.env.API_AUTH_PORT || 3000;
  await app.listen(port);
  Logger.log(
    `🚀 Authentication services is running on: ${port}/${globalPrefix}`,
  );
}

bootstrap();
