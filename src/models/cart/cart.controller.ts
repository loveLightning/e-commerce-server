import {
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Body,
  UseGuards,
} from '@nestjs/common'
import { CartService } from './cart.service'
import { JwtGuard } from '../auth/jwt.guard'
import { UpdateCartItemDto } from './cart.dto'
import { CurrentUser } from 'src/common/decorators/user.decorators'

@UseGuards(JwtGuard)
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  getCart(@CurrentUser('id') userId: number) {
    return this.cartService.getCart(userId)
  }

  @Post('/:productId')
  addProduct(
    @CurrentUser('id') userId: number,
    @Param('productId') productId: string,
  ) {
    return this.cartService.addProduct(userId, +productId)
  }

  @Delete('/:cartId')
  deleteCart(@Param('cartId') cartId: string) {
    return this.cartService.deleteCart(+cartId)
  }

  @Delete('/:cartId/:productId')
  removeProduct(
    @Param('cartId') cartId: string,
    @Param('productId') productId: string,
  ) {
    return this.cartService.removeProduct(+cartId, +productId)
  }

  @Patch('/:cartId/:productId')
  updateQuantity(
    @Param('cartId') cartId: string,
    @Param('productId') productId: string,
    @Body() cartDto: UpdateCartItemDto,
  ) {
    return this.cartService.updateQuantity(
      +cartId,
      +productId,
      cartDto.quantity,
    )
  }
}
