import { Injectable } from '@nestjs/common'
import { PrismaService } from '../common/prisma/prisma.service'

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async getDashboardStats() {
    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0)

    const [
      totalUsers, newUsersThisMonth,
      totalOrders, ordersThisMonth,
      totalRevenue, revenueThisMonth,
      revenueLastMonth,
      pendingOrders, pendingPayments,
      totalProducts, lowStockProducts,
      totalVendors, pendingVendors,
    ] = await Promise.all([
      this.prisma.user.count({ where: { role: 'CUSTOMER' } }),
      this.prisma.user.count({ where: { role: 'CUSTOMER', createdAt: { gte: startOfMonth } } }),
      this.prisma.order.count(),
      this.prisma.order.count({ where: { createdAt: { gte: startOfMonth } } }),
      this.prisma.order.aggregate({ where: { paymentStatus: 'PAID' }, _sum: { total: true } }),
      this.prisma.order.aggregate({ where: { paymentStatus: 'PAID', createdAt: { gte: startOfMonth } }, _sum: { total: true } }),
      this.prisma.order.aggregate({ where: { paymentStatus: 'PAID', createdAt: { gte: startOfLastMonth, lte: endOfLastMonth } }, _sum: { total: true } }),
      this.prisma.order.count({ where: { status: { in: ['PENDING', 'CONFIRMED'] } } }),
      this.prisma.payment.count({ where: { status: 'PENDING' } }),
      this.prisma.product.count({ where: { isActive: true } }),
      this.prisma.product.count({ where: { isActive: true, stock: { lte: 10 } } }),
      this.prisma.vendor.count(),
      this.prisma.vendor.count({ where: { status: 'PENDING' } }),
    ])

    const revenueGrowth = revenueLastMonth._sum.total
      ? ((Number(revenueThisMonth._sum.total) - Number(revenueLastMonth._sum.total)) / Number(revenueLastMonth._sum.total)) * 100
      : 100

    return {
      users: { total: totalUsers, newThisMonth: newUsersThisMonth },
      orders: { total: totalOrders, thisMonth: ordersThisMonth, pending: pendingOrders },
      revenue: {
        total: Number(totalRevenue._sum.total || 0),
        thisMonth: Number(revenueThisMonth._sum.total || 0),
        growth: Math.round(revenueGrowth * 10) / 10,
      },
      payments: { pending: pendingPayments },
      products: { total: totalProducts, lowStock: lowStockProducts },
      vendors: { total: totalVendors, pending: pendingVendors },
    }
  }

  async getRecentOrders(limit = 10) {
    return this.prisma.order.findMany({
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { id: true, firstName: true, lastName: true, email: true } },
        items: { select: { quantity: true, price: true, product: { select: { name: true } } } },
      },
    })
  }

  async getRevenueTrend(days = 30) {
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)

    const orders = await this.prisma.order.findMany({
      where: { paymentStatus: 'PAID', createdAt: { gte: startDate } },
      select: { createdAt: true, total: true },
      orderBy: { createdAt: 'asc' },
    })

    const trend: Record<string, number> = {}
    orders.forEach(order => {
      const date = order.createdAt.toISOString().split('T')[0]
      trend[date] = (trend[date] || 0) + Number(order.total)
    })

    return Object.entries(trend).map(([date, revenue]) => ({ date, revenue }))
  }

  async getTopProducts(limit = 10) {
    return this.prisma.product.findMany({
      where: { isActive: true },
      orderBy: { soldCount: 'desc' },
      take: limit,
      include: { category: true, brand: true },
    })
  }

  async getLowStockAlerts() {
    return this.prisma.product.findMany({
      where: { isActive: true, stock: { lte: 10 } },
      orderBy: { stock: 'asc' },
      take: 20,
      include: { category: true, brand: true },
    })
  }

  async getCustomers({ page = 1, limit = 15, search }: { page?: number; limit?: number; search?: string }) {
    const skip = (page - 1) * limit
    const where: any = { role: 'CUSTOMER' }
    if (search) {
      where.OR = [
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ]
    }
    const [data, total] = await Promise.all([
      this.prisma.user.findMany({
        where, skip, take: limit,
        orderBy: { createdAt: 'desc' },
        include: { _count: { select: { orders: true } } },
      }),
      this.prisma.user.count({ where }),
    ])
    return { data, total, page, totalPages: Math.ceil(total / limit) }
  }

  async updateCustomer(id: string, dto: { isActive?: boolean }) {
    return this.prisma.user.update({ where: { id }, data: dto })
  }

  async getVendors({ page = 1, limit = 15, status }: { page?: number; limit?: number; status?: string }) {
    const skip = (page - 1) * limit
    const where: any = {}
    if (status && status !== 'ALL') where.status = status
    const [data, total] = await Promise.all([
      this.prisma.vendor.findMany({
        where, skip, take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          user: { select: { id: true, firstName: true, lastName: true, email: true, phone: true } },
          _count: { select: { products: true } },
        },
      }),
      this.prisma.vendor.count({ where }),
    ])
    return { data, total, page, totalPages: Math.ceil(total / limit) }
  }

  async updateVendorStatus(id: string, status: string) {
    return this.prisma.vendor.update({ where: { id }, data: { status: status as any } })
  }

  async getAnalytics(period: string) {
    const days = period === '7d' ? 7 : period === '90d' ? 90 : 30
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)
    const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1)
    const startOfLastMonth = new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1)
    const endOfLastMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 0)

    const [
      totalRevenue, revenueThisMonth, revenueLastMonth,
      totalOrders, ordersThisMonth, pendingOrders, deliveredOrders,
      totalUsers, usersThisMonth,
      totalProducts, lowStock, outOfStock,
      topProducts, recentOrders,
    ] = await Promise.all([
      this.prisma.order.aggregate({ where: { paymentStatus: 'PAID' }, _sum: { total: true } }),
      this.prisma.order.aggregate({ where: { paymentStatus: 'PAID', createdAt: { gte: startOfMonth } }, _sum: { total: true } }),
      this.prisma.order.aggregate({ where: { paymentStatus: 'PAID', createdAt: { gte: startOfLastMonth, lte: endOfLastMonth } }, _sum: { total: true } }),
      this.prisma.order.count({ where: { createdAt: { gte: startDate } } }),
      this.prisma.order.count({ where: { createdAt: { gte: startOfMonth } } }),
      this.prisma.order.count({ where: { status: { in: ['PENDING', 'CONFIRMED'] } } }),
      this.prisma.order.count({ where: { status: 'DELIVERED' } }),
      this.prisma.user.count({ where: { role: 'CUSTOMER' } }),
      this.prisma.user.count({ where: { role: 'CUSTOMER', createdAt: { gte: startOfMonth } } }),
      this.prisma.product.count({ where: { isActive: true } }),
      this.prisma.product.count({ where: { isActive: true, stock: { gt: 0, lte: 10 } } }),
      this.prisma.product.count({ where: { isActive: true, stock: 0 } }),
      this.prisma.product.findMany({ where: { isActive: true }, orderBy: { soldCount: 'desc' }, take: 8, select: { id: true, name: true, thumbnail: true, soldCount: true, price: true } }),
      this.prisma.order.findMany({ where: { paymentStatus: 'PAID', createdAt: { gte: startDate } }, select: { createdAt: true, total: true }, orderBy: { createdAt: 'asc' } }),
    ])

    const usersGrowth = revenueLastMonth._sum.total
      ? ((Number(revenueThisMonth._sum.total) - Number(revenueLastMonth._sum.total)) / Number(revenueLastMonth._sum.total)) * 100
      : 100

    const revenueByDayMap: Record<string, { revenue: number; orders: number }> = {}
    recentOrders.forEach(o => {
      const date = o.createdAt.toISOString().split('T')[0]
      if (!revenueByDayMap[date]) revenueByDayMap[date] = { revenue: 0, orders: 0 }
      revenueByDayMap[date].revenue += Number(o.total)
      revenueByDayMap[date].orders++
    })
    const revenueByDay = Object.entries(revenueByDayMap).map(([date, v]) => ({ date, ...v }))

    return {
      revenue: { total: Number(totalRevenue._sum.total || 0), thisMonth: Number(revenueThisMonth._sum.total || 0), lastMonth: Number(revenueLastMonth._sum.total || 0), growth: Math.round(usersGrowth * 10) / 10 },
      orders: { total: totalOrders, thisMonth: ordersThisMonth, pending: pendingOrders, delivered: deliveredOrders },
      users: { total: totalUsers, thisMonth: usersThisMonth, growth: 0 },
      products: { total: totalProducts, lowStock, outOfStock },
      topProducts: topProducts.map(p => ({ ...p, totalSold: p.soldCount, revenue: Number(p.price) * p.soldCount })),
      revenueByDay,
    }
  }

  async getCoupons() {
    return this.prisma.coupon.findMany({ orderBy: { createdAt: 'desc' } })
  }

  async createCoupon(dto: any) {
    return this.prisma.coupon.create({ data: { ...dto, expiresAt: dto.expiresAt ? new Date(dto.expiresAt) : null } })
  }

  async deleteCoupon(id: string) {
    return this.prisma.coupon.delete({ where: { id } })
  }

  async getBanners() {
    return this.prisma.banner.findMany({ orderBy: { sortOrder: 'asc' } })
  }

  async updateBanner(id: string, dto: any) {
    return this.prisma.banner.update({ where: { id }, data: dto })
  }

  async getSettings() {
    const settings = await this.prisma.siteSettings?.findFirst?.().catch(() => null)
    return settings || {}
  }

  async updateSettings(dto: any) {
    const existing = await this.prisma.siteSettings?.findFirst?.().catch(() => null)
    if (existing) {
      return this.prisma.siteSettings.update({ where: { id: existing.id }, data: dto })
    }
    return dto
  }
}
