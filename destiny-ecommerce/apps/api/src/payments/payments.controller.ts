import { Controller, Get, Post, Body, Param, Query, UseGuards } from '@nestjs/common'
import { PaymentsService } from './payments.service'
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard'
import { RolesGuard } from '../common/guards/roles.guard'
import { Roles, Public } from '../common/decorators/roles.decorator'
import { UserRole, PaymentMethod } from '@prisma/client'

@Controller('payments')
export class PaymentsController {
  constructor(private paymentsService: PaymentsService) {}

  @Public()
  @Get('instructions/:method')
  getInstructions(
    @Param('method') method: string,
    @Query('amount') amount: string,
    @Query('orderNumber') orderNumber: string,
  ) {
    return this.paymentsService.getPaymentInstructions(method as PaymentMethod, parseFloat(amount), orderNumber)
  }

  @UseGuards(JwtAuthGuard)
  @Get('order/:orderId')
  getOrderPayments(@Param('orderId') orderId: string) {
    return this.paymentsService.getOrderPayments(orderId)
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @Get('pending-verifications')
  getPendingVerifications(@Query('page') page: string, @Query('limit') limit: string) {
    return this.paymentsService.getPendingVerifications(+page || 1, +limit || 20)
  }
}
