import { Module } from '@nestjs/common'
import { UsersService } from './user.service'
import { UsersController } from './user.controller'
import { PrismaService } from 'src/services/prisma/prisma.service'

@Module({
  controllers: [UsersController],
  providers: [UsersService, PrismaService],
  exports: [UsersService],
})
export class UsersModule {}
