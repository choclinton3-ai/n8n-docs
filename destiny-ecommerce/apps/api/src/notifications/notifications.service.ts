import { Injectable } from '@nestjs/common'
import { PrismaService } from '../common/prisma/prisma.service'
import { OnEvent } from '@nestjs/event-emitter'
import { EmailService } from './email.service'
import { SmsService } from './sms.service'
import { PushService } from './push.service'
import { NotificationType } from '@prisma/client'

@Injectable()
export class NotificationsService {
  constructor(
    private prisma: PrismaService,
    private email: EmailService,
    private sms: SmsService,
    private push: PushService,
  ) {}

  async create(userId: string, title: string, message: string, type: NotificationType, link?: string) {
    return this.prisma.notification.create({
      data: { userId, title, message, type, link },
    })
  }

  async findAll(userId: string, page = 1, limit = 20) {
    const skip = (page - 1) * limit
    const [data, total, unread] = await Promise.all([
      this.prisma.notification.findMany({
        where: { userId }, skip, take: limit, orderBy: { createdAt: 'desc' },
      }),
      this.prisma.notification.count({ where: { userId } }),
      this.prisma.notification.count({ where: { userId, read: false } }),
    ])
    return { data, total, unread, page, limit, totalPages: Math.ceil(total / limit) }
  }

  async markRead(id: string, userId: string) {
    return this.prisma.notification.update({
      where: { id },
      data: { read: true, readAt: new Date() },
    })
  }

  async markAllRead(userId: string) {
    await this.prisma.notification.updateMany({
      where: { userId, read: false },
      data: { read: true, readAt: new Date() },
    })
    return { message: 'All notifications marked as read' }
  }

  @OnEvent('order.created')
  async handleOrderCreated({ order, userId }: any) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } })
    if (!user) return

    await this.create(userId, 'Order Placed!', `Your order ${order.orderNumber} has been received.`, NotificationType.ORDER, `/shop/orders/${order.id}`)
    await this.email.sendOrderConfirmation(user.email, user.firstName, order.orderNumber, Number(order.total))
    if (user.phone) await this.sms.sendOrderConfirmation(user.phone, order.orderNumber, Number(order.total))
  }

  @OnEvent('payment.verified')
  async handlePaymentVerified({ orderId, approved }: any) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: { user: true },
    })
    if (!order) return

    if (approved) {
      await this.create(order.userId, 'Payment Verified ✅', `Payment for order ${order.orderNumber} confirmed!`, NotificationType.PAYMENT, `/shop/orders/${order.id}`)
      await this.email.sendPaymentVerified(order.user.email, order.user.firstName, order.orderNumber)
      if (order.user.phone) await this.sms.sendPaymentVerified(order.user.phone, order.orderNumber)
    } else {
      await this.create(order.userId, 'Payment Not Verified', `Payment for order ${order.orderNumber} could not be verified. Please resubmit.`, NotificationType.PAYMENT, `/shop/orders/${order.id}`)
    }
  }

  @OnEvent('order.status_updated')
  async handleOrderStatusUpdated({ order }: any) {
    const fullOrder = await this.prisma.order.findUnique({
      where: { id: order.id }, include: { user: true },
    })
    if (!fullOrder) return

    const messages: Record<string, string> = {
      SHIPPED: `Your order ${fullOrder.orderNumber} has been shipped!`,
      DELIVERED: `Your order ${fullOrder.orderNumber} has been delivered!`,
      CANCELLED: `Your order ${fullOrder.orderNumber} has been cancelled.`,
    }

    const msg = messages[order.status]
    if (msg) {
      await this.create(fullOrder.userId, `Order ${order.status}`, msg, NotificationType.ORDER, `/shop/orders/${order.id}`)
      if (order.status === 'SHIPPED') {
        await this.email.sendOrderShipped(fullOrder.user.email, fullOrder.user.firstName, fullOrder.orderNumber, order.trackingNumber)
      }
    }
  }
}
