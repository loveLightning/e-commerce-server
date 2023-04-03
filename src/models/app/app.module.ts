import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { AuthModule } from '../auth/auth.module'
import { CategoryModule } from '../category/category.module'
import { MailModule } from '../mail/mail.module'
import { OrderModule } from '../order/order.module'
import { PaginationModule } from '../pagination/pagination.module'
import { ProductModule } from '../product/product.module'
import { ReviewModule } from '../review/review.module'
import { StatisticsModule } from '../statistics/statistics.module'
import { UsersModule } from '../user/user.module'

@Module({
  imports: [
    AuthModule,
    UsersModule,
    CategoryModule,
    OrderModule,
    PaginationModule,
    ProductModule,
    ReviewModule,
    StatisticsModule,
    MailModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
})
export class AppModule {}
