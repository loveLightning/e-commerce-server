import {
  Body,
  Controller,
  FileTypeValidator,
  Get,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Patch,
  Put,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common'
import { UserDto } from './user.dto'
import { UsersService } from './user.service'
import { CurrentUser } from 'src/common/decorators/user.decorators'
import { JwtGuard } from '../auth/jwt.guard'
import { FileInterceptor } from '@nestjs/platform-express'
import { storage } from 'src/common/utils/storage'
import { Response } from 'express'

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('profile')
  @UseGuards(JwtGuard)
  async getProfile(@CurrentUser('id') userId: number) {
    return this.usersService.findForId(userId)
  }

  @Get('profile/:filename')
  async getPicture(@Param('filename') filename, @Res() res: Response) {
    res.sendFile(filename, { root: './uploads/avatars' })
  }

  @Patch('profile')
  @UseGuards(JwtGuard)
  async updateAvatar(
    @CurrentUser('id') userId: number,
    @Body() userDto: UserDto,
  ) {
    await this.usersService.updateProfile(userId, userDto)
  }

  @Patch('profile/avatar')
  @UseGuards(JwtGuard)
  @UseInterceptors(FileInterceptor('file', storage('avatars')))
  async updateProfile(
    @CurrentUser('id') userId: number,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new FileTypeValidator({ fileType: '.(png|jpeg|jpg)' }),
          new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 4 }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    const avatarPath = file ? file.filename : null

    return this.usersService.updateAvatar(userId, avatarPath)
  }

  @Patch('profile/favorites/:productId')
  @UseGuards(JwtGuard)
  async toggleFavorite(
    @CurrentUser('id') userId: number,
    @Param('productId') productId: string,
  ) {
    return this.usersService.toggleFavorite(userId, +productId)
  }
}
