import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Redirect,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common'
import { AuthService } from './auth.service'
import { RegisterDto, LoginDto } from './dtos/auth.dto'
import { AccessTokenDto, RefreshTokenDto } from './dtos/token.dto'
import { JwtAuthGuard } from './jwt-auth.guard'
import { LocalAuthGuard } from './local-auth.guard'
import { Response, Request } from 'express'
import { CurrentUser } from 'src/common/decorators/user.decorators'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // @HttpCode(200)
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(
    @Body() userDto: LoginDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const userData = await this.authService.login(userDto)
    response.cookie('refreshToken', userData.refreshToken, {
      maxAge: 30 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      // secure: true, => if you use https
    })

    return userData
  }

  // @HttpCode(200)
  @Post('register')
  async register(
    @Body() userDto: RegisterDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const userData = await this.authService.register(userDto)
    response.cookie('refreshToken', userData.refreshToken, {
      maxAge: 30 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      // secure: true, => if you use https
    })

    return userData
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout(
    @Res({ passthrough: true }) response: Response,
    @CurrentUser('id') id: number,
  ) {
    await this.authService.logout(id)
    response.clearCookie('refreshToken')
  }

  // @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  @Get('refresh')
  async refreshToken(@Req() request: Request) {
    const { refreshToken } = request.cookies
    return this.authService.refreshToken(refreshToken)
  }

  @Redirect(process.env.CLIENT_URL)
  @Get('activate/:token')
  async activateAccount(@Param('token') token: string) {
    await this.authService.activateAccount(token)
  }
}
