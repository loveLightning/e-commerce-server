import { Controller, Get, UseGuards } from '@nestjs/common'
import { CurrentUser } from 'src/common/decorators/user.decorators'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'
import { StatisticsService } from './statistics.service'

@Controller('statistics')
export class StatisticsController {
  constructor(private readonly statisticsService: StatisticsService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async getMain(@CurrentUser('id') userId: number) {
    return this.statisticsService.getMain(userId)
  }
}
