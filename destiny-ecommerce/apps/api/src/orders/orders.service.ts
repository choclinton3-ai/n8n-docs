import {
  Injectable, NotFoundException, BadRequestException,
  ForbiddenException, Logger,
} from '@nestjs/common'
import { PrismaService } from '../common/prisma/prisma.service'
import { CreateOrderDto, UpdateOrderStatusDto, VerifyPaymentDto } from './dto/create-order.dto'
import { OrderStatus, PaymentStatus, PaymentMethod, UserRole } from '@prisma/client'
import { EventEmitter2 } from '@nestjs/event-emitter'

@Injectable()
export class OrdersService {
  private readonly logger = new Logger(OrdersService.name)

  constructor(
    private prisma: PrismaService,
    private eventEmitter: EventEmitter2,
  ) {}

  async create(userId: string, dto: CreateOrderDto) {
    const productIds = dto.items.map(i => i.productId)
    const products = await this.prisma.product.findMany({
      where: { id: { in: productIds }, isActive: true },
    })

    if (products.length !== productIds.length) {
      throw new BadRequestException('One or more products not found or unavailable')
    }

    for (const item of dto.items) {
      const product = products.find(p => p.id === item.productId)!
      const available = product.stock - product.reservedStock
      if (available < item.quantity) {
        throw new BadRequestException(`Insufficient stock for "${product.name}". Available: ${available}`)
      }
    }

    let subtotal = 0
    const orderItems = dto.items.map(item => {
      const product = products.find(p => p.id === item.productId)!
      const price = Number(product.isFlashSale && product.flashSalePrice ? product.flashSalePrice : product.price)
      const total = price * item.quantity
      subtotal += total
      return { productId: item.productId, variantId: item.variantId, quantity: item.quantity, price, total }
    })

    let couponDiscount = 0
    let couponId: string | undefined

    if (dto.couponCode) {
      const coupon = await this.prisma.coupon.findFirst({
        where: {
          code: dto.couponCode.toUpperCase(),
          isActive: true,
          OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }],
          OR: [{ usageLimit: null }, { usageCount: { lt: this.prisma.coupon.fields.usageLimit } }] as any,
        },
      })

      if (coupon) {
        if (coupon.minOrder && subtotal < Number(coupon.minOrder)) {
          throw new BadRequestException(`Minimum order for this coupon is ${coupon.minOrder} FCFA`)
        }
        if (coupon.type === 'PERCENTAGE') {
          couponDiscount = (subtotal * Number(coupon.value)) / 100
          if (coupon.maxDiscount) couponDiscount = Math.min(couponDiscount, Number(coupon.maxDiscount))
        } else if (coupon.type === 'FIXED') {
          couponDiscount = Number(coupon.value)
        }
        couponId = coupon.id
      }
    }

    const shipping = subtotal >= 50000 ? 0 : 2000
    const total = Math.max(0, subtotal - couponDiscount + shipping)
    const orderNumber = `DEC-${Date.now()}`

    let shippingAddressId = dto.shippingAddressId
    if (!shippingAddressId && dto.shippingAddress) {
      const addr = await this.prisma.address.create({
        data: { ...dto.shippingAddress, userId, country: dto.shippingAddress.country ?? 'Cameroon' },
      })
      shippingAddressId = addr.id
    }

    const order = await this.prisma.$transaction(async (tx) => {
      const created = await tx.order.create({
        data: {
          orderNumber,
          userId,
          status: OrderStatus.PENDING,
          paymentStatus: PaymentStatus.PENDING,
          paymentMethod: dto.paymentMethod,
          subtotal,
          discount: couponDiscount,
          shipping,
          total,
          couponId,
          couponDiscount,
          shippingAddressId,
          notes: dto.notes,
          items: { create: orderItems },
        },
        include: {
          items: { include: { product: { select: { id: true, name: true, thumbnail: true } } } },
          shippingAddress: true,
        },
      })

      await tx.orderStatusHistory.create({
        data: { orderId: created.id, status: OrderStatus.PENDING, note: 'Order placed' },
      })

      for (const item of dto.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: { reservedStock: { increment: item.quantity } },
        })
      }

      if (couponId) {
        await tx.coupon.update({ where: { id: couponId }, data: { usageCount: { increment: 1 } } })
      }

      await tx.cartItem.deleteMany({ where: { userId, productId: { in: productIds } } })

      return created
    })

    this.eventEmitter.emit('order.created', { order, userId })

    return order
  }

  async findAll(userId: string, role: UserRole, page = 1, limit = 10, status?: string) {
    const skip = (page - 1) * limit
    const where: any = {}

    if (role === UserRole.CUSTOMER) where.userId = userId
    if (status) where.status = status

    const [data, total] = await Promise.all([
      this.prisma.order.findMany({
        where, skip, take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          items: { include: { product: { select: { id: true, name: true, thumbnail: true, price: true } } } },
          shippingAddress: true,
        },
      }),
      this.prisma.order.count({ where }),
    ])

    return { data, total, page, limit, totalPages: Math.ceil(total / limit) }
  }

  async findOne(id: string, userId: string, role: UserRole) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: {
        items: { include: { product: true, variant: true } },
        payments: true,
        shippingAddress: true,
        deliveryUpdates: { orderBy: { createdAt: 'asc' } },
        statusHistory: { orderBy: { createdAt: 'asc' } },
        user: { select: { id: true, firstName: true, lastName: true, email: true, phone: true } },
      },
    })

    if (!order) throw new NotFoundException('Order not found')
    if (role === UserRole.CUSTOMER && order.userId !== userId) {
      throw new ForbiddenException('Access denied')
    }

    return order
  }

  async updateStatus(id: string, dto: UpdateOrderStatusDto, adminId: string) {
    const order = await this.prisma.order.findUnique({ where: { id } })
    if (!order) throw new NotFoundException('Order not found')

    const status = dto.status as OrderStatus
    const data: any = { status }
    if (dto.trackingNumber) data.trackingNumber = dto.trackingNumber
    if (status === OrderStatus.DELIVERED) data.deliveredAt = new Date()
    if (status === OrderStatus.CANCELLED) data.cancelledAt = new Date()

    const updated = await this.prisma.$transaction(async (tx) => {
      const result = await tx.order.update({ where: { id }, data })
      await tx.orderStatusHistory.create({ data: { orderId: id, status, note: dto.note } })

      if (status === OrderStatus.CONFIRMED || status === OrderStatus.PROCESSING) {
        const items = await tx.orderItem.findMany({ where: { orderId: id } })
        for (const item of items) {
          const product = await tx.product.findUnique({ where: { id: item.productId } })
          if (product) {
            await tx.product.update({
              where: { id: item.productId },
              data: {
                stock: { decrement: item.quantity },
                reservedStock: { decrement: item.quantity },
                soldCount: { increment: item.quantity },
              },
            })
            await tx.inventoryLog.create({
              data: {
                productId: item.productId, type: 'SALE',
                quantity: -item.quantity,
                before: product.stock,
                after: product.stock - item.quantity,
                reference: order.orderNumber,
              },
            })
          }
        }
      }

      if (status === OrderStatus.CANCELLED) {
        const items = await tx.orderItem.findMany({ where: { orderId: id } })
        for (const item of items) {
          await tx.product.update({
            where: { id: item.productId },
            data: { reservedStock: { decrement: item.quantity } },
          })
        }
      }

      return result
    })

    this.eventEmitter.emit('order.status_updated', { order: updated, adminId })
    return updated
  }

  async submitPaymentProof(userId: string, dto: VerifyPaymentDto) {
    const order = await this.prisma.order.findUnique({ where: { id: dto.orderId } })
    if (!order) throw new NotFoundException('Order not found')
    if (order.userId !== userId) throw new ForbiddenException('Access denied')
    if (order.paymentStatus !== PaymentStatus.PENDING) {
      throw new BadRequestException('Payment already processed')
    }

    const payment = await this.prisma.payment.create({
      data: {
        orderId: dto.orderId,
        amount: order.total,
        currency: 'FCFA',
        method: order.paymentMethod as PaymentMethod,
        status: PaymentStatus.PENDING,
        reference: dto.transactionId,
        gatewayData: {
          transactionId: dto.transactionId,
          senderNumber: dto.senderNumber,
          amount: dto.amount,
          screenshotUrl: dto.screenshotUrl,
          submittedAt: new Date().toISOString(),
        },
      },
    })

    await this.prisma.order.update({
      where: { id: dto.orderId },
      data: { paymentReference: dto.transactionId, status: OrderStatus.CONFIRMED },
    })

    await this.prisma.orderStatusHistory.create({
      data: { orderId: dto.orderId, status: OrderStatus.CONFIRMED, note: 'Payment proof submitted — awaiting verification' },
    })

    this.eventEmitter.emit('payment.submitted', { order, payment })
    return { message: 'Payment proof submitted. Admin will verify within 30 minutes.', payment }
  }

  async verifyPayment(orderId: string, approved: boolean, adminId: string) {
    const order = await this.prisma.order.findUnique({ where: { id: orderId }, include: { payments: true } })
    if (!order) throw new NotFoundException('Order not found')

    const payment = order.payments[0]
    if (!payment) throw new BadRequestException('No payment found for this order')

    const paymentStatus = approved ? PaymentStatus.PAID : PaymentStatus.FAILED
    const orderStatus = approved ? OrderStatus.PROCESSING : OrderStatus.PENDING

    await this.prisma.$transaction([
      this.prisma.payment.update({
        where: { id: payment.id },
        data: { status: paymentStatus, paidAt: approved ? new Date() : undefined },
      }),
      this.prisma.order.update({
        where: { id: orderId },
        data: { paymentStatus, status: orderStatus },
      }),
      this.prisma.orderStatusHistory.create({
        data: {
          orderId,
          status: orderStatus,
          note: approved ? `Payment verified by admin` : 'Payment verification failed',
        },
      }),
      this.prisma.auditLog.create({
        data: {
          userId: adminId,
          action: approved ? 'APPROVE_PAYMENT' : 'REJECT_PAYMENT',
          resource: 'order', resourceId: orderId,
        },
      }),
    ])

    this.eventEmitter.emit('payment.verified', { orderId, approved })
    return { message: approved ? 'Payment approved. Order is now processing.' : 'Payment rejected.' }
  }

  async cancel(orderId: string, userId: string, reason?: string) {
    const order = await this.prisma.order.findUnique({ where: { id: orderId } })
    if (!order) throw new NotFoundException('Order not found')
    if (order.userId !== userId) throw new ForbiddenException('Access denied')
    if ([OrderStatus.SHIPPED, OrderStatus.DELIVERED].includes(order.status)) {
      throw new BadRequestException('Cannot cancel a shipped or delivered order')
    }

    await this.prisma.$transaction([
      this.prisma.order.update({
        where: { id: orderId },
        data: { status: OrderStatus.CANCELLED, cancelledAt: new Date(), cancelReason: reason },
      }),
      this.prisma.orderStatusHistory.create({
        data: { orderId, status: OrderStatus.CANCELLED, note: reason || 'Cancelled by customer' },
      }),
    ])

    this.eventEmitter.emit('order.cancelled', { orderId, userId })
    return { message: 'Order cancelled successfully' }
  }
}
