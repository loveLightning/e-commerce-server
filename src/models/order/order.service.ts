import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/services/prisma/prisma.service'
import { OrderDto } from './dtos/order.dto'
import { returnProductObj } from '../product/return.product.object'
import * as YooKassa from 'yookassa'
import { PaymentStatusDto } from './dtos/payment.dto'
import { EnumOrderItemStatus } from '@prisma/client'
import { CartService } from '../cart/cart.service'

const yooKassa = new YooKassa({
  shopId: process.env['SHOP_ID'],
  secretKey: process.env['PAYMENT_TOKEN'],
})

@Injectable()
export class OrderService {
  constructor(
    private readonly prisma: PrismaService,
    private cartService: CartService,
  ) {}
  async getAllOrders(userId: number) {
    return this.prisma.order.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        items: {
          include: {
            product: {
              select: returnProductObj,
            },
          },
        },
      },
    })
  }

  async placeOrder(orderDto: OrderDto, userId: number) {
    const total = orderDto.items.reduce((acc, cur) => {
      return acc + cur.price * cur.quantity
    }, 0)

    const order = await this.prisma.order.create({
      data: {
        status: orderDto.status,
        items: {
          create: orderDto.items,
        },
        total,
        user: {
          connect: {
            id: userId,
          },
        },
      },
    })

    const payment = await yooKassa.createPayment({
      amount: {
        value: total.toFixed(2),
        currency: 'RUB',
      },
      paymont_method_data: {
        type: 'bank_card',
      },
      confirmation: {
        type: 'redirect',
        return_url: 'http://localhost:3000/thanks',
      },
      description: `Order #${order.id}`,
    })

    return payment
  }

  async updateStatus(dto: PaymentStatusDto, userId: number) {
    if (dto.event === 'payment.waiting_for_capture') {
      const payment = await yooKassa.capturePayment(dto.object.id)
      return payment
    }

    if (dto.event === 'payment.succeeded') {
      const orderId = Number(dto.object.description.split('#')[1])

      await this.prisma.order.update({
        where: {
          id: orderId,
        },
        data: {
          status: EnumOrderItemStatus.PAYED,
        },
      })

      await this.cartService.deleteCart(userId)

      return true
    }

    return true
  }
}
