import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common'
import { PrismaService } from '../common/prisma/prisma.service'

@Injectable()
export class CouponsService {
  constructor(private prisma: PrismaService) {}

  async validate(code: string, subtotal: number) {
    const coupon = await this.prisma.coupon.findFirst({
      where: {
        code: code.toUpperCase(),
        isActive: true,
        OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }],
      },
    })

    if (!coupon) throw new NotFoundException('Invalid or expired coupon code')
    if (coupon.usageLimit && coupon.usageCount >= coupon.usageLimit) {
      throw new BadRequestException('Coupon usage limit reached')
    }
    if (coupon.minOrder && subtotal < Number(coupon.minOrder)) {
      throw new BadRequestException(`Minimum order of ${Number(coupon.minOrder).toLocaleString()} FCFA required`)
    }

    let discount = 0
    if (coupon.type === 'PERCENTAGE') {
      discount = (subtotal * Number(coupon.value)) / 100
      if (coupon.maxDiscount) discount = Math.min(discount, Number(coupon.maxDiscount))
    } else if (coupon.type === 'FIXED') {
      discount = Number(coupon.value)
    } else if (coupon.type === 'FREE_SHIPPING') {
      discount = 2000
    }

    return { coupon, discount: Math.round(discount) }
  }

  async findAll(page = 1, limit = 20) {
    const skip = (page - 1) * limit
    const [data, total] = await Promise.all([
      this.prisma.coupon.findMany({ skip, take: limit, orderBy: { createdAt: 'desc' } }),
      this.prisma.coupon.count(),
    ])
    return { data, total, page, limit, totalPages: Math.ceil(total / limit) }
  }

  async create(data: any, adminId: string) {
    const coupon = await this.prisma.coupon.create({
      data: { ...data, code: data.code.toUpperCase() },
    })
    await this.prisma.auditLog.create({
      data: { userId: adminId, action: 'CREATE_COUPON', resource: 'coupon', resourceId: coupon.id },
    })
    return coupon
  }

  async toggleStatus(id: string) {
    const coupon = await this.prisma.coupon.findUnique({ where: { id } })
    if (!coupon) throw new NotFoundException('Coupon not found')
    return this.prisma.coupon.update({ where: { id }, data: { isActive: !coupon.isActive } })
  }
}
