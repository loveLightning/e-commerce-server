import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Post,
  Redirect,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common'
import { AuthService } from './auth.service'
import { RegisterDto, LoginDto } from './dtos/auth.dto'
import { JwtGuard } from './jwt.guard'
import { LocalAuthGuard } from './local-auth.guard'
import { Response, Request } from 'express'
import { CurrentUser } from 'src/common/decorators/user.decorators'
import { setCookie } from 'src/common/utils/set-cookie'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(200)
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(
    @Body() userDto: LoginDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const userData = await this.authService.login(userDto)
    setCookie(response, userData.refreshToken)

    return userData
  }

  @HttpCode(200)
  @Post('register')
  async register(
    @Body() userDto: RegisterDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const userData = await this.authService.register(userDto)
    setCookie(response, userData.refreshToken)

    return userData
  }

  @UseGuards(JwtGuard)
  @Post('logout')
  async logout(
    @Res({ passthrough: true }) response: Response,
    @CurrentUser('id') id: number,
  ) {
    await this.authService.logout(id)
    response.clearCookie('refreshToken')
    response.clearCookie('accessToken')
  }

  @Get('refresh')
  async refreshToken(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    const { refreshToken } = request.cookies

    const dataTokens = await this.authService.refreshToken(refreshToken)
    setCookie(response, dataTokens.refreshToken)

    return dataTokens
  }

  @Redirect(process.env.CLIENT_URL)
  @Get('activate/:token')
  async activateAccount(@Param('token') token: string) {
    await this.authService.activateAccount(token)
  }
}
