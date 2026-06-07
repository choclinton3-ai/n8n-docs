import { Injectable, NotFoundException, ConflictException, ForbiddenException } from '@nestjs/common'
import { PrismaService } from '../common/prisma/prisma.service'
import { VendorStatus } from '@prisma/client'

@Injectable()
export class VendorsService {
  constructor(private prisma: PrismaService) {}

  async register(userId: string, data: { shopName: string; description?: string; phone?: string; email?: string; address?: string; city?: string; region?: string }) {
    const existing = await this.prisma.vendor.findUnique({ where: { userId } })
    if (existing) throw new ConflictException('You already have a vendor account')

    const slug = data.shopName.toLowerCase().replace(/[^a-z0-9]+/g, '-')
    const existingSlug = await this.prisma.vendor.findUnique({ where: { slug } })
    if (existingSlug) throw new ConflictException('Shop name already taken')

    const vendor = await this.prisma.vendor.create({
      data: { ...data, slug, userId, status: VendorStatus.PENDING },
    })

    await this.prisma.auditLog.create({
      data: { userId, action: 'VENDOR_REGISTER', resource: 'vendor', resourceId: vendor.id },
    })

    return vendor
  }

  async getMyVendor(userId: string) {
    const vendor = await this.prisma.vendor.findUnique({
      where: { userId },
      include: {
        _count: { select: { products: true, orders: true } },
        payouts: { take: 5, orderBy: { createdAt: 'desc' } },
      },
    })
    if (!vendor) throw new NotFoundException('Vendor account not found')
    return vendor
  }

  async findAll(page = 1, limit = 20, status?: VendorStatus) {
    const skip = (page - 1) * limit
    const where = status ? { status } : {}
    const [data, total] = await Promise.all([
      this.prisma.vendor.findMany({
        where, skip, take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          user: { select: { id: true, email: true, firstName: true, lastName: true } },
          _count: { select: { products: true, orders: true } },
        },
      }),
      this.prisma.vendor.count({ where }),
    ])
    return { data, total, page, limit, totalPages: Math.ceil(total / limit) }
  }

  async approve(id: string, adminId: string) {
    const vendor = await this.prisma.vendor.findUnique({ where: { id } })
    if (!vendor) throw new NotFoundException('Vendor not found')

    await this.prisma.$transaction([
      this.prisma.vendor.update({ where: { id }, data: { status: VendorStatus.APPROVED, verifiedAt: new Date() } }),
      this.prisma.user.update({ where: { id: vendor.userId }, data: { role: 'VENDOR' } }),
      this.prisma.auditLog.create({
        data: { userId: adminId, action: 'APPROVE_VENDOR', resource: 'vendor', resourceId: id },
      }),
    ])

    return { message: 'Vendor approved successfully' }
  }

  async reject(id: string, adminId: string, reason?: string) {
    const vendor = await this.prisma.vendor.findUnique({ where: { id } })
    if (!vendor) throw new NotFoundException('Vendor not found')

    await this.prisma.vendor.update({ where: { id }, data: { status: VendorStatus.REJECTED } })
    await this.prisma.auditLog.create({
      data: { userId: adminId, action: 'REJECT_VENDOR', resource: 'vendor', resourceId: id, details: { reason } },
    })

    return { message: 'Vendor rejected' }
  }

  async getDashboard(userId: string) {
    const vendor = await this.prisma.vendor.findUnique({ where: { userId } })
    if (!vendor) throw new NotFoundException('Vendor account not found')

    const [totalProducts, totalOrders, totalRevenue] = await Promise.all([
      this.prisma.product.count({ where: { vendorId: vendor.id, isActive: true } }),
      this.prisma.order.count({ where: { vendorId: vendor.id } }),
      this.prisma.order.aggregate({
        where: { vendorId: vendor.id, paymentStatus: 'PAID' },
        _sum: { total: true },
      }),
    ])

    return {
      vendor,
      stats: {
        totalProducts,
        totalOrders,
        totalRevenue: totalRevenue._sum.total || 0,
      },
    }
  }
}
