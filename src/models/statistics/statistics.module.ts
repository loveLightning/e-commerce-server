import { Module } from '@nestjs/common'
import { StatisticsService } from './statistics.service'
import { StatisticsController } from './statistics.controller'
import { PrismaService } from 'src/services/prisma/prisma.service'
import { UsersService } from '../user/user.service'

@Module({
  controllers: [StatisticsController],
  providers: [StatisticsService, PrismaService, UsersService],
})
export class StatisticsModule {}
