// src/feedback/schemas/feedback.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export enum FeedbackStatus {
  DRAFT = 'draft',
  SUBMITTED = 'submitted',
}

@Schema({ timestamps: true })
export class Feedback extends Document {
  @Prop({ type: Types.ObjectId, ref: 'Review', required: true })
  reviewId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Employee', required: true })
  reviewerId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Employee', required: true })
  employeeId: Types.ObjectId;

  @Prop({ required: true })
  content: string;

  @Prop({ required: true, min: 1, max: 5 })
  rating: number;

  @Prop({ required: true, enum: FeedbackStatus, default: FeedbackStatus.DRAFT })
  status: FeedbackStatus;

  @Prop([String])
  categories: string[];
}

export const FeedbackSchema = SchemaFactory.createForClass(Feedback);
