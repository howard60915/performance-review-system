// src/reviews/dto/create-review.dto.ts
import { IsString, IsDate, IsMongoId, IsArray, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';
import { ReviewStatus } from '../schemas/review.schema';

export class CreateReviewDto {
  @IsMongoId()
  employeeId: string;

  @IsArray()
  @IsMongoId({ each: true })
  reviewerIds: string[];

  @IsString()
  period: string;

  @IsEnum(ReviewStatus)
  status: ReviewStatus;

  @Type(() => Date)
  @IsDate()
  dueDate: Date;
}
