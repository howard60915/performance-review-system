// src/feedback/controllers/feedback.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  // UseGuards,
  Req,
} from '@nestjs/common';
import { FeedbackService } from './feedback.service';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { UpdateFeedbackDto } from './dto/update-feedback.dto';
// import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@Controller('feedback')
// @UseGuards(JwtAuthGuard)
export class FeedbackController {
  constructor(private readonly feedbackService: FeedbackService) {}

  @Post()
  create(@Body() createFeedbackDto: CreateFeedbackDto, @Req() req: any) {
    return this.feedbackService.create(createFeedbackDto, req.user.id);
  }

  @Get('my-feedback')
  findMyFeedback(@Req() req: any) {
    return this.feedbackService.findByReviewer(req.user.id);
  }

  @Get('pending')
  findPendingFeedback(@Req() req: any) {
    return this.feedbackService.findPendingByReviewer(req.user.id);
  }

  @Post(':id/submit')
  submit(@Param('id') id: string, @Req() req: any) {
    return this.feedbackService.submitFeedback(id, req.user.id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateFeedbackDto: UpdateFeedbackDto,
    @Req() req: any,
  ) {
    return this.feedbackService.update(id, updateFeedbackDto, req.user.id);
  }
}
