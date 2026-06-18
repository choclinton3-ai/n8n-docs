import { Controller, Get, Post, Patch, Body, Param, UseGuards } from '@nestjs/common'
import { DeliveryService } from './delivery.service'
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard'
import { RolesGuard } from '../common/guards/roles.guard'
import { Roles, Public } from '../common/decorators/roles.decorator'
import { CurrentUser } from '../common/decorators/current-user.decorator'
import { UserRole } from '@prisma/client'

@UseGuards(JwtAuthGuard)
@Controller('delivery')
export class DeliveryController {
  constructor(private deliveryService: DeliveryService) {}

  @Get('order/:orderId')
  getUpdates(@Param('orderId') orderId: string) {
    return this.deliveryService.getUpdates(orderId)
  }

  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.DELIVERY)
  @Post('order/:orderId/update')
  addUpdate(@Param('orderId') orderId: string, @Body() body: any) {
    return this.deliveryService.addUpdate(orderId, body)
  }

  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @Patch('order/:orderId/assign')
  assignAgent(@Param('orderId') orderId: string, @Body() body: { agentId: string }, @CurrentUser('id') adminId: string) {
    return this.deliveryService.assignDeliveryAgent(orderId, body.agentId, adminId)
  }

  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @Get('active')
  getActive() { return this.deliveryService.getActiveDeliveries() }
}
