import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from 'src/services/prisma/prisma.service'
import { ReviewDto } from './review.dto'

@Injectable()
export class ReviewService {
  constructor(private readonly prisma: PrismaService) {}

  async leaveReview(reviewDto: ReviewDto, userId: number, productId: number) {
    const product = await this.prisma.product.count({
      where: {
        id: productId,
      },
    })

    if (!product) throw new NotFoundException('Product not found')

    return this.prisma.review.create({
      data: {
        ...reviewDto,
        product: {
          connect: {
            id: productId,
          },
        },
        user: {
          connect: {
            id: userId,
          },
        },
      },
    })
  }

  async getAllReview() {
    return this.prisma.review.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    })
  }

  async getAverageProduct(productId: number) {
    return this.prisma.review
      .aggregate({
        where: {
          id: productId,
        },
        _avg: {
          rating: true,
        },
      })
      .then((data) => data._avg)
  }
}
