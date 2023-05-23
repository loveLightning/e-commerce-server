import { Controller, Get, UseGuards } from '@nestjs/common'
import { CurrentUser } from 'src/common/decorators/user.decorators'
import { JwtGuard } from '../auth/jwt.guard'
import { StatisticsService } from './statistics.service'

@Controller('statistics')
export class StatisticsController {
  constructor(private readonly statisticsService: StatisticsService) {}

  @Get()
  @UseGuards(JwtGuard)
  async getMain(@CurrentUser('id') userId: number) {
    return this.statisticsService.getMain(userId)
  }
}
