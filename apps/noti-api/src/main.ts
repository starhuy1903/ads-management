import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import {
  ClientOptions,
  MicroserviceOptions,
  Transport,
} from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { MAIL_PACKAGE_NAME } from './proto/mail-schedule.pb';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );

  const configService = app.get(ConfigService);

  const grpcUrl = configService.get('GRPC_URL');

  await app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.GRPC,
    options: {
      package: MAIL_PACKAGE_NAME,
      protoPath: 'apps/noti-api/src/proto/mail-schedule.proto',
      url: grpcUrl,
    },
  });

  const port = configService.get('PORT') || 3000;
  await app.listen(port);
  await app.startAllMicroservices();
}
bootstrap();
