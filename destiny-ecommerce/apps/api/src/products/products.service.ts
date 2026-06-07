import { Injectable, NotFoundException, ConflictException } from '@nestjs/common'
import { PrismaService } from '../common/prisma/prisma.service'
import { CreateProductDto } from './dto/create-product.dto'
import { Prisma } from '@prisma/client'

interface ProductQuery {
  page?: number; limit?: number; search?: string; category?: string; brand?: string
  minPrice?: string; maxPrice?: string; priceMin?: number; priceMax?: number
  inStock?: boolean | string; isFeatured?: boolean | string; isFlashSale?: boolean | string
  featured?: boolean | string; flashSale?: boolean | string
  sortBy?: string; order?: string; rating?: number
}

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async findAll(query: ProductQuery) {
    const page = query.page || 1
    const limit = Math.min(query.limit || 20, 100)
    const skip = (page - 1) * limit

    const where: Prisma.ProductWhereInput = { isActive: true }

    if (query.search) {
      where.OR = [
        { name: { contains: query.search, mode: 'insensitive' } },
        { description: { contains: query.search, mode: 'insensitive' } },
      ]
    }
    if (query.category) where.category = { slug: query.category }
    if (query.brand) where.brand = { slug: query.brand }

    const minP = query.priceMin ?? (query.minPrice ? parseFloat(query.minPrice) : undefined)
    const maxP = query.priceMax ?? (query.maxPrice ? parseFloat(query.maxPrice) : undefined)
    if (minP !== undefined || maxP !== undefined) {
      where.price = {}
      if (minP !== undefined) (where.price as any).gte = minP
      if (maxP !== undefined) (where.price as any).lte = maxP
    }
    if (query.inStock === true || query.inStock === 'true') where.stock = { gt: 0 }
    if (query.featured === true || query.featured === 'true') where.isFeatured = true
    if (query.flashSale === true || query.flashSale === 'true') where.isFlashSale = true
    if (query.rating) where.rating = { gte: query.rating }

    const orderBy: Prisma.ProductOrderByWithRelationInput =
      query.sortBy === 'price_asc' ? { price: 'asc' }
      : query.sortBy === 'price_desc' ? { price: 'desc' }
      : query.sortBy === 'rating' ? { rating: 'desc' }
      : query.sortBy === 'popular' ? { soldCount: 'desc' }
      : { createdAt: 'desc' }

    const [data, total] = await Promise.all([
      this.prisma.product.findMany({
        where, skip, take: limit, orderBy,
        include: {
          category: { select: { id: true, name: true, slug: true, icon: true } },
          brand: { select: { id: true, name: true, slug: true, logo: true } },
          _count: { select: { reviews: true } },
        },
      }),
      this.prisma.product.count({ where }),
    ])

    return { data, total, page, limit, totalPages: Math.ceil(total / limit) }
  }

  async findBySlug(slug: string) {
    const product = await this.prisma.product.findFirst({
      where: { OR: [{ slug }, { id: slug }], isActive: true },
      include: {
        category: true, brand: true,
        specifications: { orderBy: { sortOrder: 'asc' } },
        variants: { where: { isActive: true } },
        reviews: {
          where: { isActive: true },
          include: { user: { select: { id: true, firstName: true, lastName: true, avatar: true } } },
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
        _count: { select: { reviews: true } },
      },
    })
    if (!product) throw new NotFoundException('Product not found')
    await this.prisma.product.update({ where: { id: product.id }, data: { viewCount: { increment: 1 } } })
    return product
  }

  async getFeatured() {
    return this.prisma.product.findMany({
      where: { isFeatured: true, isActive: true, stock: { gt: 0 } },
      take: 8,
      include: { category: { select: { id: true, name: true, slug: true } }, brand: { select: { id: true, name: true } } },
    })
  }

  async getNewArrivals() {
    return this.prisma.product.findMany({
      where: { isNew: true, isActive: true, stock: { gt: 0 } },
      take: 8,
      orderBy: { createdAt: 'desc' },
      include: { category: { select: { id: true, name: true, slug: true } }, brand: { select: { id: true, name: true } } },
    })
  }

  async getBestSellers() {
    return this.prisma.product.findMany({
      where: { isBestSeller: true, isActive: true, stock: { gt: 0 } },
      take: 8,
      orderBy: { soldCount: 'desc' },
      include: { category: { select: { id: true, name: true, slug: true } }, brand: { select: { id: true, name: true } } },
    })
  }

  async getFlashSale() {
    return this.prisma.product.findMany({
      where: { isFlashSale: true, isActive: true, stock: { gt: 0 }, flashSaleEnd: { gt: new Date() } },
      include: { category: { select: { id: true, name: true, slug: true } }, brand: { select: { id: true, name: true } } },
    })
  }

  async getRelated(id: string) {
    const product = await this.prisma.product.findUnique({ where: { id }, select: { categoryId: true, brandId: true } })
    if (!product) return []
    return this.prisma.product.findMany({
      where: { OR: [{ categoryId: product.categoryId }, { brandId: product.brandId }], id: { not: id }, isActive: true },
      take: 6,
      include: { category: true, brand: true },
    })
  }

  async create(dto: CreateProductDto, user: any) {
    const slug = this.slugify(dto.name)
    if (await this.prisma.product.findUnique({ where: { slug } })) {
      throw new ConflictException('Product with this name already exists')
    }
    if (await this.prisma.product.findUnique({ where: { sku: dto.sku } })) {
      throw new ConflictException('SKU already in use')
    }

    const { specifications, ...productData } = dto
    const product = await this.prisma.product.create({
      data: {
        ...productData,
        slug,
        vendorId: user.role === 'VENDOR' ? user.vendorId : productData.vendorId,
        specifications: specifications ? { create: specifications } : undefined,
      },
      include: { category: true, brand: true, specifications: true },
    })

    await this.prisma.inventoryLog.create({
      data: {
        productId: product.id, type: 'RESTOCK',
        quantity: dto.stock, before: 0, after: dto.stock,
        note: 'Initial stock',
      },
    })

    return product
  }

  async update(id: string, dto: Partial<CreateProductDto>, user: any) {
    if (!await this.prisma.product.findUnique({ where: { id } })) {
      throw new NotFoundException('Product not found')
    }
    const { specifications, ...rest } = dto
    return this.prisma.product.update({
      where: { id },
      data: rest,
      include: { category: true, brand: true, specifications: true },
    })
  }

  async remove(id: string) {
    if (!await this.prisma.product.findUnique({ where: { id } })) {
      throw new NotFoundException('Product not found')
    }
    await this.prisma.product.update({ where: { id }, data: { isActive: false } })
    return { message: 'Product removed' }
  }

  async toggleFlashSale(id: string, body: { endDate?: string; price?: number }) {
    const product = await this.prisma.product.findUnique({ where: { id } })
    if (!product) throw new NotFoundException('Product not found')
    return this.prisma.product.update({
      where: { id },
      data: {
        isFlashSale: !product.isFlashSale,
        flashSaleEnd: body.endDate ? new Date(body.endDate) : undefined,
        flashSalePrice: body.price,
      },
    })
  }

  private slugify(name: string): string {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
  }
}
