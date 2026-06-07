import { Injectable, NotFoundException, ConflictException, ForbiddenException, BadRequestException } from '@nestjs/common'
import { PrismaService } from '../common/prisma/prisma.service'

@Injectable()
export class ReviewsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, productId: string, data: { rating: number; title?: string; comment: string; orderId?: string }) {
    const product = await this.prisma.product.findUnique({ where: { id: productId } })
    if (!product) throw new NotFoundException('Product not found')

    if (data.rating < 1 || data.rating > 5) throw new BadRequestException('Rating must be 1–5')

    const existing = await this.prisma.review.findUnique({ where: { userId_productId: { userId, productId } } })
    if (existing) throw new ConflictException('You have already reviewed this product')

    const review = await this.prisma.review.create({
      data: { userId, productId, ...data, verified: !!data.orderId },
      include: { user: { select: { id: true, firstName: true, lastName: true, avatar: true } } },
    })

    await this.updateProductRating(productId)
    return review
  }

  async findByProduct(productId: string, page = 1, limit = 10) {
    const skip = (page - 1) * limit
    const where = { productId, isActive: true }
    const [data, total] = await Promise.all([
      this.prisma.review.findMany({
        where, skip, take: limit,
        orderBy: { createdAt: 'desc' },
        include: { user: { select: { id: true, firstName: true, lastName: true, avatar: true } } },
      }),
      this.prisma.review.count({ where }),
    ])

    const stats = await this.prisma.review.groupBy({
      by: ['rating'],
      where: { productId, isActive: true },
      _count: { rating: true },
    })

    return { data, total, page, limit, totalPages: Math.ceil(total / limit), stats }
  }

  async delete(id: string, userId: string, isAdmin = false) {
    const review = await this.prisma.review.findUnique({ where: { id } })
    if (!review) throw new NotFoundException('Review not found')
    if (!isAdmin && review.userId !== userId) throw new ForbiddenException('Cannot delete this review')

    await this.prisma.review.update({ where: { id }, data: { isActive: false } })
    await this.updateProductRating(review.productId)
    return { message: 'Review removed' }
  }

  private async updateProductRating(productId: string) {
    const result = await this.prisma.review.aggregate({
      where: { productId, isActive: true },
      _avg: { rating: true },
      _count: { rating: true },
    })

    await this.prisma.product.update({
      where: { id: productId },
      data: {
        rating: result._avg.rating || 0,
        reviewCount: result._count.rating,
      },
    })
  }
}
