import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../common/prisma/prisma.service'
import { MtnMomoService } from './gateways/mtn-momo.service'
import { OrangeMoneyService } from './gateways/orange-money.service'
import { PaymentMethod } from '@prisma/client'

@Injectable()
export class PaymentsService {
  constructor(
    private prisma: PrismaService,
    private mtn: MtnMomoService,
    private orangeMoney: OrangeMoneyService,
  ) {}

  getPaymentInstructions(method: PaymentMethod, amount: number, orderNumber: string) {
    if (method === PaymentMethod.MTN_MOBILE_MONEY) {
      return this.mtn.getPaymentInstructions(amount, orderNumber)
    }
    if (method === PaymentMethod.ORANGE_MONEY) {
      return this.orangeMoney.getPaymentInstructions(amount, orderNumber)
    }
    return {
      method: 'Other',
      instructions: ['Please contact support for payment instructions'],
    }
  }

  async getOrderPayments(orderId: string) {
    return this.prisma.payment.findMany({
      where: { orderId },
      orderBy: { createdAt: 'desc' },
    })
  }

  async getPendingVerifications(page = 1, limit = 20) {
    const skip = (page - 1) * limit
    const where = { status: 'PENDING' as any }
    const [data, total] = await Promise.all([
      this.prisma.payment.findMany({
        where, skip, take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          order: {
            include: {
              user: { select: { id: true, firstName: true, lastName: true, email: true, phone: true } },
            },
          },
        },
      }),
      this.prisma.payment.count({ where }),
    ])
    return { data, total, page, limit, totalPages: Math.ceil(total / limit) }
  }
}
