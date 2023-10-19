import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ScheduleDocument = HydratedDocument<Schedule>;

@Schema()
export class Schedule {
  @Prop()
  name: string;

  @Prop()
  priority: string;

  @Prop()
  scheduleTime: string;

  @Prop()
  template: string;

  @Prop()
  time: Date;

  @Prop()
  data: any;
}

export const ScheduleSchema = SchemaFactory.createForClass(Schedule);
