import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/services/prisma/prisma.service'

@Injectable()
export class OrderService {
  constructor(private readonly prisma: PrismaService) {}
  async getAllOrders(userId: number) {
    return this.prisma.order.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })
  }
}
