import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common'
import { CurrentUser } from 'src/common/decorators/user.decorators'
import { JwtGuard } from '../auth/jwt.guard'
import { ReviewDto } from './review.dto'
import { ReviewService } from './review.service'

@Controller('reviews')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Post('leave/:productId')
  @UseGuards(JwtGuard)
  async leaveReview(
    @Param('productId') productId: string,
    @Body() reviewDto: ReviewDto,
    @CurrentUser('id') userId: number,
  ) {
    return this.reviewService.leaveReview(reviewDto, userId, +productId)
  }

  @Get()
  async getAllReview() {
    return this.reviewService.getAllReview()
  }

  @Get('average')
  async getAverageProduct(@Body() productId: number) {
    return this.reviewService.getAverageProduct(productId)
  }
}
