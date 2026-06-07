import { Controller, Get, Post, Put, Delete, Query, Param, Body, UseGuards, Req } from '@nestjs/common'
import { AdminService } from './admin.service'
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard'
import { RolesGuard } from '../common/guards/roles.guard'
import { Roles } from '../common/decorators/roles.decorator'
import { UserRole } from '@prisma/client'

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
@Controller('admin')
export class AdminController {
  constructor(private adminService: AdminService) {}

  @Get('dashboard')
  getDashboard() { return this.adminService.getDashboardStats() }

  @Get('recent-orders')
  getRecentOrders(@Query('limit') limit: string) {
    return this.adminService.getRecentOrders(+limit || 10)
  }

  @Get('revenue-trend')
  getRevenueTrend(@Query('days') days: string) {
    return this.adminService.getRevenueTrend(+days || 30)
  }

  @Get('top-products')
  getTopProducts(@Query('limit') limit: string) {
    return this.adminService.getTopProducts(+limit || 10)
  }

  @Get('low-stock')
  getLowStockAlerts() { return this.adminService.getLowStockAlerts() }

  // Customers
  @Get('customers')
  getCustomers(@Query('page') page: string, @Query('limit') limit: string, @Query('search') search: string) {
    return this.adminService.getCustomers({ page: +page || 1, limit: +limit || 15, search })
  }

  @Put('customers/:id')
  updateCustomer(@Param('id') id: string, @Body() dto: any) {
    return this.adminService.updateCustomer(id, dto)
  }

  // Vendors
  @Get('vendors')
  getVendors(@Query('page') page: string, @Query('limit') limit: string, @Query('status') status: string) {
    return this.adminService.getVendors({ page: +page || 1, limit: +limit || 15, status })
  }

  @Put('vendors/:id/approve')
  approveVendor(@Param('id') id: string) {
    return this.adminService.updateVendorStatus(id, 'ACTIVE')
  }

  @Put('vendors/:id/suspend')
  suspendVendor(@Param('id') id: string) {
    return this.adminService.updateVendorStatus(id, 'SUSPENDED')
  }

  // Analytics
  @Get('analytics')
  getAnalytics(@Query('period') period: string) {
    return this.adminService.getAnalytics(period || '30d')
  }

  // Coupons
  @Get('coupons')
  getCoupons() { return this.adminService.getCoupons() }

  @Post('coupons')
  createCoupon(@Body() dto: any) { return this.adminService.createCoupon(dto) }

  @Delete('coupons/:id')
  deleteCoupon(@Param('id') id: string) { return this.adminService.deleteCoupon(id) }

  // Banners
  @Get('banners')
  getBanners() { return this.adminService.getBanners() }

  @Put('banners/:id')
  updateBanner(@Param('id') id: string, @Body() dto: any) {
    return this.adminService.updateBanner(id, dto)
  }

  // Settings
  @Get('settings')
  getSettings() { return this.adminService.getSettings() }

  @Put('settings')
  updateSettings(@Body() dto: any) { return this.adminService.updateSettings(dto) }
}
