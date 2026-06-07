import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common'
import { PrismaService } from '../common/prisma/prisma.service'
import { InventoryLogType } from '@prisma/client'

@Injectable()
export class InventoryService {
  constructor(private prisma: PrismaService) {}

  async adjustStock(productId: string, quantity: number, type: InventoryLogType, note?: string, adminId?: string) {
    const product = await this.prisma.product.findUnique({ where: { id: productId } })
    if (!product) throw new NotFoundException('Product not found')

    const newStock = product.stock + quantity
    if (newStock < 0) throw new BadRequestException('Insufficient stock')

    await this.prisma.$transaction([
      this.prisma.product.update({ where: { id: productId }, data: { stock: newStock } }),
      this.prisma.inventoryLog.create({
        data: {
          productId, type,
          quantity: Math.abs(quantity),
          before: product.stock,
          after: newStock,
          note,
        },
      }),
    ])

    if (newStock <= product.lowStockAlert) {
      // emit low stock event for notifications
    }

    return { productId, before: product.stock, after: newStock, type }
  }

  async getLogs(productId?: string, page = 1, limit = 20) {
    const skip = (page - 1) * limit
    const where = productId ? { productId } : {}
    const [data, total] = await Promise.all([
      this.prisma.inventoryLog.findMany({
        where, skip, take: limit,
        orderBy: { createdAt: 'desc' },
        include: { product: { select: { id: true, name: true, sku: true } } },
      }),
      this.prisma.inventoryLog.count({ where }),
    ])
    return { data, total, page, limit, totalPages: Math.ceil(total / limit) }
  }

  async getLowStockProducts() {
    return this.prisma.product.findMany({
      where: { isActive: true, stock: { lte: this.prisma.product.fields.lowStockAlert as any } },
      include: { category: true, brand: true },
      orderBy: { stock: 'asc' },
    })
  }

  async bulkAdjust(adjustments: Array<{ productId: string; quantity: number; note?: string }>, adminId: string) {
    return Promise.all(
      adjustments.map(adj =>
        this.adjustStock(adj.productId, adj.quantity, InventoryLogType.ADJUSTMENT, adj.note, adminId),
      ),
    )
  }
}
