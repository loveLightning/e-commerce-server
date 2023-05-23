import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Role, User } from '@prisma/client'
import { verify } from 'argon2'
import { PrismaService } from 'src/services/prisma/prisma.service'
import { UsersService } from '../user/user.service'
import { LoginDto, RegisterDto } from './dtos/auth.dto'
import { MailService } from '../mail/mail.service'

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private usersService: UsersService,
    private mailService: MailService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findForEmail(email)

    if (!user) throw new NotFoundException('Invalid password or email')

    const isValid = await verify(user.password, pass)

    if (!isValid) throw new UnauthorizedException('Invalid password or email')

    if (!user.isActivated)
      throw new HttpException(
        'You need to confirm your email address',
        HttpStatus.FORBIDDEN,
      )

    const { password, ...result } = user
    return result
  }

  async register(userDto: RegisterDto) {
    const user = await this.usersService.create(userDto)
    const tokens = await this.createTokens(user.id, user.role)

    await this.mailService.sendActivationEmail(
      userDto.email,
      `${process.env.API_URL}/auth/activate/${tokens.refreshToken}`,
    )

    await this.saveToken(user.id, tokens.refreshToken)

    return {
      user: this.returnUserFields(user),
      ...tokens,
    }
  }

  async login(userDto: LoginDto) {
    const { email } = userDto
    const user = await this.usersService.findForEmail(email)

    const tokens = await this.createTokens(user.id, user.role)

    await this.saveToken(user.id, tokens.refreshToken)

    return {
      user: this.returnUserFields(user),
      ...tokens,
    }
  }

  async refreshToken(refreshToken: string) {
    if (!refreshToken) throw new UnauthorizedException()
    const result = await this.jwtService.verifyAsync(refreshToken)
    const user = await this.prisma.user.findUnique({
      where: {
        id: result.id,
      },
    })

    const tokenFromDb = await this.findToken(refreshToken)

    if (!result || !user || !tokenFromDb)
      throw new UnauthorizedException('Invalid refresh token')

    const tokens = await this.createTokens(user.id, user.role)
    await this.saveToken(user.id, tokens.refreshToken)

    return {
      user: this.returnUserFields(user),
      ...tokens,
    }
  }

  async saveToken(userId: number, refreshToken: string) {
    const tokenData = await this.prisma.token.findUnique({
      where: {
        id: userId,
      },
    })

    if (tokenData) {
      return await this.prisma.token.update({
        data: {
          refreshToken,
        },
        where: {
          id: userId,
        },
      })
    }

    return await this.prisma.token.create({
      data: {
        refreshToken,
        id: userId,
      },
    })
  }

  async activateAccount(token: string) {
    const { id } = await this.jwtService.verifyAsync(token)
    const user = await this.prisma.user.findFirst({
      where: {
        id,
      },
    })

    if (!user) throw new NotFoundException('An incorrect link activation')

    await this.prisma.user.update({
      where: {
        id,
      },
      data: {
        isActivated: true,
      },
    })
  }

  async logout(id: number) {
    return await this.prisma.token.delete({
      where: {
        id,
      },
    })
  }

  private async createTokens(userId: number, role: Role) {
    const payload = { id: userId, role }

    const accessToken = this.jwtService.sign(payload, {
      expiresIn: '1h',
    })

    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: '7d',
    })

    return { accessToken, refreshToken }
  }

  private async findToken(refreshToken: string) {
    const tokenData = await this.prisma.token.findFirst({
      where: {
        refreshToken,
      },
    })

    return tokenData
  }

  private returnUserFields(user: User) {
    return {
      id: user.id,
      email: user.email,
      isActivated: user.isActivated,
      role: user.role,
    }
  }
}
