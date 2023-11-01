import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type TemplateDocument = HydratedDocument<Template>;

@Schema()
export class Template {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop({ required: true })
  source: string;

  @Prop()
  subject: string;

  @Prop({ required: true, type: JSON })
  validation: object;
}

export const TemplateSchema = SchemaFactory.createForClass(Template);
