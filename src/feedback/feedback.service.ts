// src/feedback/services/feedback.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Feedback, FeedbackStatus } from './schemas/feedback.schema';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { UpdateFeedbackDto } from './dto/update-feedback.dto';

@Injectable()
export class FeedbackService {
  constructor(
    @InjectModel(Feedback.name) private feedbackModel: Model<Feedback>,
  ) {}

  async create(
    createFeedbackDto: CreateFeedbackDto,
    reviewerId: string,
  ): Promise<Feedback> {
    const feedback = new this.feedbackModel({
      ...createFeedbackDto,
      reviewerId: new Types.ObjectId(reviewerId),
      reviewId: new Types.ObjectId(createFeedbackDto.reviewId),
    });
    return feedback.save();
  }

  async findByReviewer(reviewerId: string): Promise<Feedback[]> {
    return this.feedbackModel
      .find({ reviewerId: new Types.ObjectId(reviewerId) })
      .populate({
        path: 'reviewId',
        populate: {
          path: 'employeeId',
          select: 'firstName lastName email',
        },
      })
      .exec();
  }
  async findPendingByReviewer(reviewerId: string): Promise<Feedback[]> {
    return this.feedbackModel
      .find({
        reviewerId: new Types.ObjectId(reviewerId),
        status: FeedbackStatus.DRAFT,
      })
      .populate('reviewId')
      .populate('employeeId', 'firstName lastName email')
      .exec();
  }

  async submitFeedback(id: string, reviewerId: string): Promise<Feedback> {
    const feedback = await this.feedbackModel.findOne({
      _id: id,
      reviewerId: new Types.ObjectId(reviewerId),
      status: FeedbackStatus.DRAFT,
    });

    if (!feedback) {
      throw new NotFoundException('Feedback not found or already submitted');
    }

    feedback.status = FeedbackStatus.SUBMITTED;
    return feedback.save();
  }

  async update(
    id: string,
    updateFeedbackDto: UpdateFeedbackDto,
    reviewerId: string,
  ): Promise<Feedback> {
    const feedback = await this.feedbackModel
      .findOneAndUpdate(
        {
          _id: id,
          reviewerId: new Types.ObjectId(reviewerId),
          status: FeedbackStatus.DRAFT,
        },
        updateFeedbackDto,
        { new: true },
      )
      .exec();

    if (!feedback) {
      throw new NotFoundException('Feedback not found or cannot be updated');
    }

    return feedback;
  }
}
