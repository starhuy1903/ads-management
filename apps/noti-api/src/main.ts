import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import {
  ClientOptions,
  MicroserviceOptions,
  Transport,
} from '@nestjs/microservices';
import { join } from 'path';
import { ConfigService } from '@nestjs/config';
import { MAIL_PACKAGE_NAME } from './proto/mail-schedule.pb';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // app.use(express.json());
  // app.use(express.urlencoded());
  // app.use(express.text({ type: '*/*' }));
  app.enableCors();

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );

  const configService = app.get(ConfigService);

  const grpcUrl = configService.get('GRPC_URL');
  const grpcClientOptions: ClientOptions = {
    transport: Transport.GRPC,
    options: {
      package: MAIL_PACKAGE_NAME, // Specify the name of your gRPC service package
      protoPath: 'apps/noti-api/src/proto/mail-schedule.proto', // Path to your .proto file
      url: grpcUrl, // URL or IP address of the gRPC server
    },
  };

  //Create gRPC server instance
  const grpcServer = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    grpcClientOptions,
  );

  // Start gRPC server
  await grpcServer.listen();
  console.log('GRPC Server listen port:', configService.get('GRPC_URL'));

  const port = configService.get('PORT') || 3002;

  // Start the application
  await app.listen(port);
  console.log('Server listen port:', port);

  
  // await app.connectMicroservice<MicroserviceOptions>({
  //   transport: Transport.GRPC,
  //   options: {
  //     package: MAIL_PACKAGE_NAME,
  //     protoPath: join(__dirname, '../proto/mail-schedule.proto'),
  //     url: grpcUrl
  //   },
  // });
 
  // const port = configService.get('PORT') || 3000;
  // await app.listen(port);
  // await app.startAllMicroservices();
}
bootstrap();
