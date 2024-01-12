import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app/app.module';
import InitFirebase from './services/firebase';
import { WinstonModule } from 'nest-winston';
import { transports, format } from 'winston';
import 'winston-daily-rotate-file';
import { Logtail } from '@logtail/node';
import { LogtailTransport } from '@logtail/winston';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Multer } from 'multer'; // cheating type, dont delete

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: WinstonModule.createLogger({
      transports: [
        new transports.DailyRotateFile({
          filename: `apps/main-api/logs/%DATE%.log`,
          format: format.combine(format.timestamp(), format.json()),
          datePattern: 'YYYY-MM-DD',
          maxSize: 1000000, // 100KB
        }),
        new transports.Console({
          format: format.combine(
            format.cli(),
            format.splat(),
            format.timestamp(),
            format.printf((info) => {
              return `${info.timestamp} ${info.level}:${info.message}`;
            }),
          ),
        }),
        new LogtailTransport(new Logtail('R4RQL9tjA76cJE9vFu3VEg3G')),
      ],
    }),
  });
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
