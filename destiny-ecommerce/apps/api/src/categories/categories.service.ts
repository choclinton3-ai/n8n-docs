import { Injectable, NotFoundException, ConflictException } from '@nestjs/common'
import { PrismaService } from '../common/prisma/prisma.service'

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.category.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' },
      include: {
        _count: { select: { products: true } },
        children: { where: { isActive: true }, select: { id: true, name: true, slug: true, icon: true } },
      },
    })
  }

  async findOne(slug: string) {
    const cat = await this.prisma.category.findFirst({
      where: { OR: [{ slug }, { id: slug }] },
      include: { children: { where: { isActive: true } }, _count: { select: { products: true } } },
    })
    if (!cat) throw new NotFoundException('Category not found')
    return cat
  }

  async create(data: { name: string; slug?: string; description?: string; icon?: string; image?: string; parentId?: string }) {
    const slug = data.slug || data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')
    if (await this.prisma.category.findUnique({ where: { slug } })) {
      throw new ConflictException('Category slug already in use')
    }
    return this.prisma.category.create({ data: { ...data, slug, isActive: true } })
  }

  async update(id: string, data: Partial<{ name: string; description: string; icon: string; image: string; isActive: boolean; sortOrder: number }>) {
    if (!await this.prisma.category.findUnique({ where: { id } })) throw new NotFoundException('Category not found')
    return this.prisma.category.update({ where: { id }, data })
  }

  async remove(id: string) {
    const cat = await this.prisma.category.findUnique({ where: { id }, include: { _count: { select: { products: true } } } })
    if (!cat) throw new NotFoundException('Category not found')
    await this.prisma.category.update({ where: { id }, data: { isActive: false } })
    return { message: 'Category deactivated' }
  }
}
