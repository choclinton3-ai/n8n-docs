import { Injectable, NotFoundException, ConflictException } from '@nestjs/common'
import { PrismaService } from '../common/prisma/prisma.service'

@Injectable()
export class BrandsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.brand.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' },
      include: { _count: { select: { products: true } } },
    })
  }

  async findOne(slug: string) {
    const brand = await this.prisma.brand.findFirst({
      where: { OR: [{ slug }, { id: slug }] },
      include: { _count: { select: { products: true } } },
    })
    if (!brand) throw new NotFoundException('Brand not found')
    return brand
  }

  async create(data: { name: string; slug?: string; logo?: string; description?: string; country?: string; website?: string }) {
    const slug = data.slug || data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')
    if (await this.prisma.brand.findUnique({ where: { slug } })) {
      throw new ConflictException('Brand slug already in use')
    }
    return this.prisma.brand.create({ data: { ...data, slug, isActive: true } })
  }

  async update(id: string, data: any) {
    if (!await this.prisma.brand.findUnique({ where: { id } })) throw new NotFoundException('Brand not found')
    return this.prisma.brand.update({ where: { id }, data })
  }

  async remove(id: string) {
    if (!await this.prisma.brand.findUnique({ where: { id } })) throw new NotFoundException('Brand not found')
    await this.prisma.brand.update({ where: { id }, data: { isActive: false } })
    return { message: 'Brand deactivated' }
  }
}
