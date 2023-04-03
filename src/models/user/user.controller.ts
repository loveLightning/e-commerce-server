import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Put,
  UseGuards,
} from '@nestjs/common'
import { UserDto } from './user.dto'
import { UsersService } from './user.service'
import { CurrentUser } from 'src/common/decorators/user.decorators'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  async getProfile(@CurrentUser('id') userId: number) {
    return this.usersService.findForId(userId)
  }

  @Put('profile')
  @UseGuards(JwtAuthGuard)
  async updateProfile(
    @CurrentUser('id') userId: number,
    @Body() userDto: UserDto,
  ) {
    return this.usersService.updateProfile(userId, userDto)
  }

  @Patch('profile/favorites/:productId')
  @UseGuards(JwtAuthGuard)
  async toggleFavorite(
    @CurrentUser('id') userId: number,
    @Param('productId') productId: string,
  ) {
    return this.usersService.toggleFavorite(userId, +productId)
  }
}
