import { Controller, Get, Query, UseGuards } from '@nestjs/common'
import { AnalyticsService } from './analytics.service'
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard'
import { RolesGuard } from '../common/guards/roles.guard'
import { Roles } from '../common/decorators/roles.decorator'
import { UserRole } from '@prisma/client'

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
@Controller('analytics')
export class AnalyticsController {
  constructor(private analyticsService: AnalyticsService) {}

  @Get('sales')
  getSales(@Query('start') start: string, @Query('end') end: string) {
    const startDate = start ? new Date(start) : new Date(new Date().setDate(1))
    const endDate = end ? new Date(end) : new Date()
    return this.analyticsService.getSalesReport(startDate, endDate)
  }

  @Get('customers')
  getCustomers() { return this.analyticsService.getCustomerStats() }

  @Get('orders/status')
  getOrderStatus() { return this.analyticsService.getOrderStatusBreakdown() }

  @Get('payments/methods')
  getPaymentMethods() { return this.analyticsService.getPaymentMethodBreakdown() }
}
