import {
  IsString, IsNumber, IsOptional, IsBoolean,
  IsArray, Min, IsDateString,
} from 'class-validator'
import { Type } from 'class-transformer'

export class CreateProductDto {
  @IsString()
  name: string

  @IsString()
  description: string

  @IsOptional()
  @IsString()
  shortDescription?: string

  @IsString()
  sku: string

  @IsNumber()
  @Type(() => Number)
  @Min(0)
  price: number

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  originalPrice?: number

  @IsOptional()
  @IsNumber()
  discount?: number

  @IsString()
  categoryId: string

  @IsString()
  brandId: string

  @IsOptional()
  @IsString()
  vendorId?: string

  @IsNumber()
  @Type(() => Number)
  @Min(0)
  stock: number

  @IsOptional()
  @IsArray()
  images?: string[]

  @IsOptional()
  @IsString()
  thumbnail?: string

  @IsOptional()
  @IsBoolean()
  isFeatured?: boolean

  @IsOptional()
  @IsBoolean()
  isNew?: boolean

  @IsOptional()
  @IsBoolean()
  isBestSeller?: boolean

  @IsOptional()
  @IsBoolean()
  isFlashSale?: boolean

  @IsOptional()
  @IsNumber()
  flashSalePrice?: number

  @IsOptional()
  @IsDateString()
  flashSaleEnd?: string

  @IsOptional()
  @IsString()
  warranty?: string

  @IsOptional()
  @IsArray()
  tags?: string[]

  @IsOptional()
  specifications?: Array<{ label: string; value: string; sortOrder?: number }>
}

export class ProductQueryDto {
  @IsOptional()
  page?: string

  @IsOptional()
  limit?: string

  @IsOptional()
  search?: string

  @IsOptional()
  category?: string

  @IsOptional()
  brand?: string

  @IsOptional()
  minPrice?: string

  @IsOptional()
  maxPrice?: string

  @IsOptional()
  inStock?: string

  @IsOptional()
  isFeatured?: string

  @IsOptional()
  isFlashSale?: string

  @IsOptional()
  sortBy?: string

  @IsOptional()
  order?: string
}
