import { Controller, Get, Query } from '@nestjs/common'
import { SearchService } from './search.service'
import { Public } from '../common/decorators/roles.decorator'

@Controller('search')
export class SearchController {
  constructor(private searchService: SearchService) {}

  @Public()
  @Get()
  search(
    @Query('q') query: string,
    @Query('category') category: string,
    @Query('brand') brand: string,
    @Query('minPrice') minPrice: string,
    @Query('maxPrice') maxPrice: string,
    @Query('inStock') inStock: string,
    @Query('page') page: string,
    @Query('limit') limit: string,
  ) {
    return this.searchService.search(query || '', {
      category, brand,
      minPrice: minPrice ? parseFloat(minPrice) : undefined,
      maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
      inStock: inStock === 'true',
      page: +page || 1,
      limit: +limit || 20,
    })
  }

  @Public()
  @Get('suggestions')
  getSuggestions(@Query('q') query: string) {
    return this.searchService.getSuggestions(query || '')
  }
}
