import {
  Controller, Get, Post, Patch, Body, Param,
  Query, UseGuards, HttpCode, HttpStatus,
} from '@nestjs/common'
import { OrdersService } from './orders.service'
import { CreateOrderDto, UpdateOrderStatusDto, VerifyPaymentDto } from './dto/create-order.dto'
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard'
import { RolesGuard } from '../common/guards/roles.guard'
import { Roles } from '../common/decorators/roles.decorator'
import { CurrentUser } from '../common/decorators/current-user.decorator'
import { UserRole } from '@prisma/client'

@UseGuards(JwtAuthGuard)
@Controller('orders')
export class OrdersController {
  constructor(private ordersService: OrdersService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@CurrentUser('id') userId: string, @Body() dto: CreateOrderDto) {
    return this.ordersService.create(userId, dto)
  }

  @Get()
  findAll(
    @CurrentUser('id') userId: string,
    @CurrentUser('role') role: UserRole,
    @Query('page') page: string,
    @Query('limit') limit: string,
    @Query('status') status: string,
  ) {
    return this.ordersService.findAll(userId, role, +page || 1, +limit || 10, status)
  }

  @Get(':id')
  findOne(
    @Param('id') id: string,
    @CurrentUser('id') userId: string,
    @CurrentUser('role') role: UserRole,
  ) {
    return this.ordersService.findOne(id, userId, role)
  }

  @Post('submit-payment')
  @HttpCode(HttpStatus.OK)
  submitPaymentProof(@CurrentUser('id') userId: string, @Body() dto: VerifyPaymentDto) {
    return this.ordersService.submitPaymentProof(userId, dto)
  }

  @Post(':id/cancel')
  @HttpCode(HttpStatus.OK)
  cancel(@Param('id') id: string, @CurrentUser('id') userId: string, @Body() body: { reason?: string }) {
    return this.ordersService.cancel(id, userId, body.reason)
  }

  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @Patch(':id/status')
  updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateOrderStatusDto,
    @CurrentUser('id') adminId: string,
  ) {
    return this.ordersService.updateStatus(id, dto, adminId)
  }

  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @Post(':id/verify-payment')
  @HttpCode(HttpStatus.OK)
  verifyPayment(
    @Param('id') id: string,
    @Body() body: { approved: boolean },
    @CurrentUser('id') adminId: string,
  ) {
    return this.ordersService.verifyPayment(id, body.approved, adminId)
  }
}
