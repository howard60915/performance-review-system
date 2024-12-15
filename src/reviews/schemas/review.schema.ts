// src/reviews/schemas/review.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export enum ReviewStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
}

@Schema({ timestamps: true })
export class Review extends Document {
  @Prop({ type: Types.ObjectId, ref: 'Employee', required: true })
  employeeId: Types.ObjectId;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Employee' }] })
  reviewerIds: Types.ObjectId[];

  @Prop({ required: true })
  period: string;

  @Prop({ required: true, enum: ReviewStatus, default: ReviewStatus.PENDING })
  status: ReviewStatus;

  @Prop({ required: true })
  dueDate: Date;
}

export const ReviewSchema = SchemaFactory.createForClass(Review);
