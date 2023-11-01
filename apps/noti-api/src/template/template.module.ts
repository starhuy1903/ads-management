import { Module } from '@nestjs/common';
import { TemplateService } from './template.service';
import { TemplateController } from './template.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Template, TemplateSchema } from '../schemas/template.schema';
import { AwsSesModule } from '../aws-ses/aws-ses.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Template.name, schema: TemplateSchema },
    ]),
    AwsSesModule,
  ],
  exports: [TemplateService],
  providers: [TemplateService],
  controllers: [TemplateController],
})
export class TemplateModule {}
