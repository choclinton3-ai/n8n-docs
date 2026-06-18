import { Controller, Get, Post, Delete, Body, Param, Query, UseGuards } from '@nestjs/common'
import { ReviewsService } from './reviews.service'
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard'
import { RolesGuard } from '../common/guards/roles.guard'
import { Roles, Public } from '../common/decorators/roles.decorator'
import { CurrentUser } from '../common/decorators/current-user.decorator'
import { UserRole } from '@prisma/client'

@Controller('reviews')
export class ReviewsController {
  constructor(private reviewsService: ReviewsService) {}

  @Public()
  @Get('product/:productId')
  findByProduct(@Param('productId') productId: string, @Query('page') page: string, @Query('limit') limit: string) {
    return this.reviewsService.findByProduct(productId, +page || 1, +limit || 10)
  }

  @UseGuards(JwtAuthGuard)
  @Post('product/:productId')
  create(@Param('productId') productId: string, @CurrentUser('id') userId: string, @Body() body: any) {
    return this.reviewsService.create(userId, productId, body)
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  delete(@Param('id') id: string, @CurrentUser('id') userId: string, @CurrentUser('role') role: string) {
    return this.reviewsService.delete(id, userId, [UserRole.ADMIN, UserRole.SUPER_ADMIN].includes(role as UserRole))
  }
}
