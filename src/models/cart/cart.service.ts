import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/services/prisma/prisma.service'

@Injectable()
export class CartService {
  constructor(private prisma: PrismaService) {}
  async getCart(userId: number) {
    return this.prisma.cart.findFirst({
      where: { userId },

      include: {
        cartItems: {
          orderBy: {
            createdAt: 'asc',
          },
          include: { product: true },
        },
      },
    })
  }

  async addProduct(userId: number, productId: number) {
    let cart = await this.getCart(userId)

    if (!cart) {
      cart = await this.prisma.cart.create({
        data: {
          userId,
        },
        include: { cartItems: { include: { product: true } } },
      })
    }

    const existingCartItem = await this.prisma.cartItem.findFirst({
      where: { cartId: cart.id, productId },
    })

    if (existingCartItem) {
      return this.updateQuantity(
        cart.id,
        productId,
        existingCartItem.quantity + 1,
      )
    }

    return this.prisma.cartItem.create({
      data: {
        cartId: cart.id,
        productId,
        quantity: 1,
      },
    })
  }

  async deleteCart(cartId: number) {
    await this.prisma.cartItem.deleteMany({
      where: { cartId },
    })

    return this.prisma.cart.delete({
      where: { id: cartId },
    })
  }

  async removeProduct(cartId: number, productId: number) {
    return this.prisma.cartItem.deleteMany({
      where: { cartId, productId },
    })
  }

  async updateQuantity(cartId: number, productId: number, quantity: number) {
    return this.prisma.cartItem.updateMany({
      where: { cartId, productId },
      data: { quantity },
    })
  }
}
