import { Injectable } from '@nestjs/common'
import { PrismaService } from '../common/prisma/prisma.service'

@Injectable()
export class AnalyticsService {
  constructor(private prisma: PrismaService) {}

  async getSalesReport(startDate: Date, endDate: Date) {
    const [orders, revenue, topProducts, categoryRevenue] = await Promise.all([
      this.prisma.order.count({ where: { createdAt: { gte: startDate, lte: endDate } } }),
      this.prisma.order.aggregate({
        where: { paymentStatus: 'PAID', createdAt: { gte: startDate, lte: endDate } },
        _sum: { total: true },
        _avg: { total: true },
      }),
      this.prisma.orderItem.groupBy({
        by: ['productId'],
        where: { order: { paymentStatus: 'PAID', createdAt: { gte: startDate, lte: endDate } } },
        _sum: { quantity: true, total: true },
        orderBy: { _sum: { total: 'desc' } },
        take: 10,
      }),
      this.prisma.orderItem.groupBy({
        by: ['productId'],
        where: { order: { paymentStatus: 'PAID', createdAt: { gte: startDate, lte: endDate } } },
        _sum: { total: true },
      }),
    ])

    return {
      period: { from: startDate, to: endDate },
      orders,
      revenue: {
        total: Number(revenue._sum.total || 0),
        average: Number(revenue._avg.total || 0),
      },
      topProducts,
    }
  }

  async getCustomerStats() {
    const [total, verified, withOrders, newThisMonth] = await Promise.all([
      this.prisma.user.count({ where: { role: 'CUSTOMER' } }),
      this.prisma.user.count({ where: { role: 'CUSTOMER', emailVerified: true } }),
      this.prisma.user.count({ where: { role: 'CUSTOMER', orders: { some: {} } } }),
      this.prisma.user.count({
        where: { role: 'CUSTOMER', createdAt: { gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1) } },
      }),
    ])
    return { total, verified, withOrders, newThisMonth, conversionRate: total ? Math.round((withOrders / total) * 100) : 0 }
  }

  async getOrderStatusBreakdown() {
    const statuses = await this.prisma.order.groupBy({
      by: ['status'],
      _count: { status: true },
    })
    return statuses.reduce((acc: any, s) => {
      acc[s.status] = s._count.status
      return acc
    }, {})
  }

  async getPaymentMethodBreakdown() {
    const methods = await this.prisma.payment.groupBy({
      by: ['method'],
      where: { status: 'PAID' },
      _count: { method: true },
      _sum: { amount: true },
    })
    return methods.map(m => ({
      method: m.method,
      count: m._count.method,
      total: Number(m._sum.amount || 0),
    }))
  }
}
