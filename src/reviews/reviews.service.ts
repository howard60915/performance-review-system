// src/reviews/services/reviews.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Review } from './schemas/review.schema';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';

@Injectable()
export class ReviewsService {
  constructor(@InjectModel(Review.name) private reviewModel: Model<Review>) {}

  async create(createReviewDto: CreateReviewDto): Promise<Review> {
    const review = new this.reviewModel({
      ...createReviewDto,
      employeeId: new Types.ObjectId(createReviewDto.employeeId),
      reviewerIds: createReviewDto.reviewerIds.map(
        (id) => new Types.ObjectId(id),
      ),
    });
    return review.save();
  }

  async findAll(): Promise<Review[]> {
    return this.reviewModel
      .find()
      .populate('employeeId', 'firstName lastName email')
      .populate('reviewerIds', 'firstName lastName email')
      .exec();
  }

  async findOne(id: string): Promise<Review> {
    const review = await this.reviewModel
      .findById(id)
      .populate('employeeId', 'firstName lastName email')
      .populate('reviewerIds', 'firstName lastName email')
      .exec();

    if (!review) {
      throw new NotFoundException(`Review #${id} not found`);
    }
    return review;
  }

  async findByReviewer(reviewerId: string): Promise<Review[]> {
    return this.reviewModel
      .find({ reviewerIds: new Types.ObjectId(reviewerId) })
      .populate('employeeId', 'firstName lastName email')
      .exec();
  }

  async update(id: string, updateReviewDto: UpdateReviewDto): Promise<Review> {
    const review = await this.reviewModel
      .findByIdAndUpdate(id, updateReviewDto, { new: true })
      .exec();

    if (!review) {
      throw new NotFoundException(`Review #${id} not found`);
    }
    return review;
  }

  async remove(id: string): Promise<Review> {
    const review = await this.reviewModel.findByIdAndDelete(id).exec();
    if (!review) {
      throw new NotFoundException(`Review #${id} not found`);
    }
    return review;
  }
}
