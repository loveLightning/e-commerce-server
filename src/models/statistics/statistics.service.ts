import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/services/prisma/prisma.service'
import { UsersService } from '../user/user.service'

@Injectable()
export class StatisticsService {
  constructor(
    private prisma: PrismaService,
    private userService: UsersService,
  ) {}

  async getMain(userId: number) {
    const user = await this.userService.findForId(userId, {
      orders: {
        select: {
          item: true,
        },
      },
      reviews: true,
    })

    return [
      {
        name: 'Orders',
        value: user.orders.length,
      },
      {
        name: 'Reviews',
        value: user.reviews.length,
      },
      {
        name: 'Favorites',
        value: user.favorites.length,
      },
    ]
  }
}
