import { faker } from '@faker-js/faker'
import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { Prisma, User } from '@prisma/client'
import { hash } from 'argon2'
import { PrismaService } from 'src/services/prisma/prisma.service'
import { RegisterDto } from '../auth/dtos/auth.dto'
import { returnFavoritesObj, returnUserObj } from './return-user.object'
import { UserDto } from './user.dto'

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findForEmail(email: string) {
    return await this.prisma.user.findUnique({
      where: {
        email,
      },
    })
  }

  async findForId(
    userId: string | number,
    selectObject: Prisma.UserSelect = {},
  ) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: +userId,
      },
      select: {
        ...returnUserObj,
        favorites: {
          select: {
            ...returnFavoritesObj,
          },
        },
        ...selectObject,
      },
    })

    if (!user) {
      throw new NotFoundException('Email not found')
    }

    return user
  }

  async create(userDto: RegisterDto): Promise<User> {
    const existUser = await this.prisma.user.findUnique({
      where: {
        email: userDto.email,
      },
    })

    if (existUser && existUser.isActivated) {
      throw new HttpException('User already exist', HttpStatus.CONFLICT)
    }

    if (existUser && !existUser.isActivated) {
      return existUser
    }

    return await this.prisma.user.create({
      data: {
        role: 'ADMIN' as const,
        email: userDto.email,
        password: await hash(userDto.password),
        name: faker.name.firstName(),
        avatarPath: '',
        phone: faker.phone.number('+7 (###) ###-##-##'),
        activationLink: '',
      },
    })
  }

  async updateProfile(userId: number, dtoUser: UserDto) {
    const updateFileds: Prisma.UserUpdateInput = {
      name: dtoUser.name,
      phone: dtoUser.phone,
    }
    await this.updateFileds(userId, updateFileds)
  }

  async updateAvatar(userId: number, avatarPath: string) {
    const updateFileds: Prisma.UserUpdateInput = {
      avatarPath: avatarPath,
    }

    await this.updateFileds(userId, updateFileds)
  }

  async toggleFavorite(userId: number, productId: number) {
    const user = await this.findForId(userId)

    if (!user) throw new NotFoundException('Email not found')
    const isExists = user.favorites.some((el) => el.id === productId)

    await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        favorites: {
          [isExists ? 'disconnect' : 'connect']: {
            id: productId,
          },
        },
      },
    })
  }

  private async updateFileds(userId: number, fields: Prisma.UserUpdateInput) {
    await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: fields,
    })
  }
}
