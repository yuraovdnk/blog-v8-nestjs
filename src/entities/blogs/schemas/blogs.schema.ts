import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ versionKey: false })
export class Blog extends Document {
  @Prop({
    type: String,
    min: 1,
    max: 15,
    required: true,
  })
  name: string;

  @Prop({
    type: String,
    min: 1,
    max: 100,
    required: true,
  })
  youtubeUrl: string;
}
export const BlogsSchema = SchemaFactory.createForClass(Blog);
