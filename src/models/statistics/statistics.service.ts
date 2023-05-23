import { Injectable } from '@nestjs/common'
import { UsersService } from '../user/user.service'

@Injectable()
export class StatisticsService {
  constructor(private userService: UsersService) {}

  async getMain(userId: number) {
    const user = await this.userService.findForId(userId, {
      orders: {
        select: {
          items: true,
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
