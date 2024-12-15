import {
  IsString,
  IsNumber,
  IsMongoId,
  IsEnum,
  IsArray,
  Min,
  Max,
} from 'class-validator';
import { FeedbackStatus } from '../schemas/feedback.schema';

export class CreateFeedbackDto {
  @IsMongoId()
  reviewId: string;

  @IsString()
  content: string;

  @IsNumber()
  @Min(1)
  @Max(5)
  rating: number;

  @IsEnum(FeedbackStatus)
  status: FeedbackStatus;

  @IsArray()
  @IsString({ each: true })
  categories: string[];
}
