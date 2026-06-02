import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { ThrottlerModule } from '@nestjs/throttler'
import { EventEmitterModule } from '@nestjs/event-emitter'
import { ScheduleModule } from '@nestjs/schedule'
import { PrismaModule } from './common/prisma/prisma.module'
import { AuthModule } from './auth/auth.module'
import { UsersModule } from './users/users.module'
import { ProductsModule } from './products/products.module'
import { CategoriesModule } from './categories/categories.module'
import { BrandsModule } from './brands/brands.module'
import { OrdersModule } from './orders/orders.module'
import { PaymentsModule } from './payments/payments.module'
import { VendorsModule } from './vendors/vendors.module'
import { AdminModule } from './admin/admin.module'
import { InventoryModule } from './inventory/inventory.module'
import { NotificationsModule } from './notifications/notifications.module'
import { ReviewsModule } from './reviews/reviews.module'
import { CouponsModule } from './coupons/coupons.module'
import { AnalyticsModule } from './analytics/analytics.module'
import { DeliveryModule } from './delivery/delivery.module'
import { SupportModule } from './support/support.module'
import { SearchModule } from './search/search.module'

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    ThrottlerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        ttl: 60,
        limit: config.get('RATE_LIMIT', 100),
      }),
    }),
    EventEmitterModule.forRoot(),
    ScheduleModule.forRoot(),
    PrismaModule,
    AuthModule,
    UsersModule,
    ProductsModule,
    CategoriesModule,
    BrandsModule,
    OrdersModule,
    PaymentsModule,
    VendorsModule,
    AdminModule,
    InventoryModule,
    NotificationsModule,
    ReviewsModule,
    CouponsModule,
    AnalyticsModule,
    DeliveryModule,
    SupportModule,
    SearchModule,
  ],
})
export class AppModule {}
