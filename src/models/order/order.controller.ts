import { Controller, Get, UseGuards } from '@nestjs/common'
import { CurrentUser } from 'src/common/decorators/user.decorators'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'
import { OrderService } from './order.service'

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async getAllOrders(@CurrentUser('id') userId: number) {
    return this.orderService.getAllOrders(userId)
  }
}
