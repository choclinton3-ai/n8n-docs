import { Controller, Get, Post, Patch, Body, Param, Query, UseGuards } from '@nestjs/common'
import { VendorsService } from './vendors.service'
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard'
import { RolesGuard } from '../common/guards/roles.guard'
import { Roles } from '../common/decorators/roles.decorator'
import { CurrentUser } from '../common/decorators/current-user.decorator'
import { UserRole, VendorStatus } from '@prisma/client'

@UseGuards(JwtAuthGuard)
@Controller('vendors')
export class VendorsController {
  constructor(private vendorsService: VendorsService) {}

  @Post('register')
  register(@CurrentUser('id') userId: string, @Body() body: any) {
    return this.vendorsService.register(userId, body)
  }

  @Get('me')
  getMyVendor(@CurrentUser('id') userId: string) {
    return this.vendorsService.getMyVendor(userId)
  }

  @Get('me/dashboard')
  getDashboard(@CurrentUser('id') userId: string) {
    return this.vendorsService.getDashboard(userId)
  }

  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @Get()
  findAll(@Query('page') page: string, @Query('limit') limit: string, @Query('status') status: string) {
    return this.vendorsService.findAll(+page || 1, +limit || 20, status as VendorStatus)
  }

  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @Patch(':id/approve')
  approve(@Param('id') id: string, @CurrentUser('id') adminId: string) {
    return this.vendorsService.approve(id, adminId)
  }

  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @Patch(':id/reject')
  reject(@Param('id') id: string, @CurrentUser('id') adminId: string, @Body() body: { reason?: string }) {
    return this.vendorsService.reject(id, adminId, body.reason)
  }
}
