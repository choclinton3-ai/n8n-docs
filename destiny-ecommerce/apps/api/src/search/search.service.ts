import { Injectable, Logger } from '@nestjs/common'
import { PrismaService } from '../common/prisma/prisma.service'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class SearchService {
  private readonly logger = new Logger(SearchService.name)
  private esClient: any = null

  constructor(private prisma: PrismaService, private config: ConfigService) {
    const esUrl = config.get('ELASTICSEARCH_URL')
    if (esUrl) {
      try {
        const { Client } = require('@elastic/elasticsearch')
        this.esClient = new Client({ node: esUrl })
        this.logger.log('Elasticsearch connected')
      } catch {
        this.logger.warn('Elasticsearch client not installed — using database search')
      }
    }
  }

  async search(query: string, filters?: {
    category?: string; brand?: string; minPrice?: number; maxPrice?: number
    inStock?: boolean; page?: number; limit?: number
  }) {
    if (this.esClient) {
      return this.elasticsearchSearch(query, filters)
    }
    return this.databaseSearch(query, filters)
  }

  private async databaseSearch(query: string, filters?: any) {
    const page = filters?.page || 1
    const limit = Math.min(filters?.limit || 20, 100)
    const skip = (page - 1) * limit

    const where: any = { isActive: true }
    if (query) {
      where.OR = [
        { name: { contains: query, mode: 'insensitive' } },
        { description: { contains: query, mode: 'insensitive' } },
        { shortDescription: { contains: query, mode: 'insensitive' } },
        { tags: { has: query } },
      ]
    }
    if (filters?.category) where.category = { slug: filters.category }
    if (filters?.brand) where.brand = { slug: filters.brand }
    if (filters?.inStock) where.stock = { gt: 0 }
    if (filters?.minPrice || filters?.maxPrice) {
      where.price = {}
      if (filters.minPrice) where.price.gte = filters.minPrice
      if (filters.maxPrice) where.price.lte = filters.maxPrice
    }

    const [data, total] = await Promise.all([
      this.prisma.product.findMany({
        where, skip, take: limit,
        include: {
          category: { select: { id: true, name: true, slug: true } },
          brand: { select: { id: true, name: true } },
        },
        orderBy: [{ isFeatured: 'desc' }, { soldCount: 'desc' }],
      }),
      this.prisma.product.count({ where }),
    ])

    return { data, total, page, limit, totalPages: Math.ceil(total / limit), engine: 'database' }
  }

  private async elasticsearchSearch(query: string, filters?: any) {
    const page = filters?.page || 1
    const limit = Math.min(filters?.limit || 20, 100)

    try {
      const { hits } = await this.esClient.search({
        index: 'products',
        from: (page - 1) * limit,
        size: limit,
        query: {
          bool: {
            must: query ? [{ multi_match: { query, fields: ['name^3', 'description', 'tags^2'], type: 'best_fields', fuzziness: 'AUTO' } }] : [{ match_all: {} }],
            filter: [
              { term: { isActive: true } },
              ...(filters?.category ? [{ term: { 'category.slug': filters.category } }] : []),
              ...(filters?.brand ? [{ term: { 'brand.slug': filters.brand } }] : []),
              ...(filters?.inStock ? [{ range: { stock: { gt: 0 } } }] : []),
              ...(filters?.minPrice || filters?.maxPrice ? [{ range: { price: { gte: filters?.minPrice, lte: filters?.maxPrice } } }] : []),
            ],
          },
        },
      })

      return {
        data: hits.hits.map((h: any) => h._source),
        total: hits.total.value,
        page, limit,
        totalPages: Math.ceil(hits.total.value / limit),
        engine: 'elasticsearch',
      }
    } catch (error) {
      this.logger.error(`Elasticsearch error: ${error.message}, falling back to DB`)
      return this.databaseSearch(query, filters)
    }
  }

  async getSuggestions(query: string) {
    const products = await this.prisma.product.findMany({
      where: { name: { contains: query, mode: 'insensitive' }, isActive: true },
      select: { id: true, name: true, slug: true, thumbnail: true },
      take: 8,
    })
    return products
  }
}
