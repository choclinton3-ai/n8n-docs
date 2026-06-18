import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../common/prisma/prisma.service'
import { EventEmitter2 } from '@nestjs/event-emitter'

@Injectable()
export class DeliveryService {
  constructor(private prisma: PrismaService, private eventEmitter: EventEmitter2) {}

  async addUpdate(orderId: string, data: {
    status: string; location?: string; description?: string
    latitude?: number; longitude?: number; photoUrl?: string
  }) {
    const order = await this.prisma.order.findUnique({ where: { id: orderId } })
    if (!order) throw new NotFoundException('Order not found')

    const update = await this.prisma.deliveryUpdate.create({
      data: { orderId, ...data },
    })

    this.eventEmitter.emit('delivery.updated', { orderId, update })
    return update
  }

  async getUpdates(orderId: string) {
    return this.prisma.deliveryUpdate.findMany({
      where: { orderId },
      orderBy: { createdAt: 'asc' },
    })
  }

  async assignDeliveryAgent(orderId: string, agentId: string, adminId: string) {
    const order = await this.prisma.order.findUnique({ where: { id: orderId } })
    if (!order) throw new NotFoundException('Order not found')

    const updated = await this.prisma.order.update({
      where: { id: orderId },
      data: { deliveryPersonId: agentId },
    })

    await this.prisma.auditLog.create({
      data: { userId: adminId, action: 'ASSIGN_DELIVERY', resource: 'order', resourceId: orderId },
    })

    return updated
  }

  async getActiveDeliveries() {
    return this.prisma.order.findMany({
      where: { status: { in: ['SHIPPED', 'OUT_FOR_DELIVERY'] } },
      include: {
        user: { select: { id: true, firstName: true, lastName: true, phone: true } },
        shippingAddress: true,
        deliveryUpdates: { orderBy: { createdAt: 'desc' }, take: 1 },
      },
      orderBy: { updatedAt: 'desc' },
    })
  }
}
