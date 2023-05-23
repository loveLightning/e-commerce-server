import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  UseGuards,
} from '@nestjs/common'
import { CurrentUser } from 'src/common/decorators/user.decorators'
import { JwtGuard } from '../auth/jwt.guard'
import { OrderService } from './order.service'
import { OrderDto } from './dtos/order.dto'
import { PaymentStatusDto } from './dtos/payment.dto'

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Get()
  @UseGuards(JwtGuard)
  async getAllOrders(@CurrentUser('id') userId: number) {
    return this.orderService.getAllOrders(userId)
  }

  @Post()
  @HttpCode(200)
  @UseGuards(JwtGuard)
  async placeOrder(
    @Body() orderDto: OrderDto,
    @CurrentUser('id') userId: number,
  ) {
    return this.orderService.placeOrder(orderDto, userId)
  }

  @HttpCode(200)
  @Post('status')
  async updateStatus(
    @Body() dto: PaymentStatusDto,
    @CurrentUser('id') userId: number,
  ) {
    return this.orderService.updateStatus(dto, userId)
  }
}
