import { Controller, Get, Post, Body, Query, UseGuards } from '@nestjs/common'
import { InventoryService } from './inventory.service'
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard'
import { RolesGuard } from '../common/guards/roles.guard'
import { Roles } from '../common/decorators/roles.decorator'
import { CurrentUser } from '../common/decorators/current-user.decorator'
import { UserRole, InventoryLogType } from '@prisma/client'

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
@Controller('inventory')
export class InventoryController {
  constructor(private inventoryService: InventoryService) {}

  @Post('adjust')
  adjust(@Body() body: { productId: string; quantity: number; type: InventoryLogType; note?: string }, @CurrentUser('id') adminId: string) {
    return this.inventoryService.adjustStock(body.productId, body.quantity, body.type, body.note, adminId)
  }

  @Get('logs')
  getLogs(@Query('productId') productId: string, @Query('page') page: string, @Query('limit') limit: string) {
    return this.inventoryService.getLogs(productId, +page || 1, +limit || 20)
  }

  @Get('low-stock')
  getLowStock() { return this.inventoryService.getLowStockProducts() }

  @Post('bulk-adjust')
  bulkAdjust(@Body() body: { adjustments: any[] }, @CurrentUser('id') adminId: string) {
    return this.inventoryService.bulkAdjust(body.adjustments, adminId)
  }
}
