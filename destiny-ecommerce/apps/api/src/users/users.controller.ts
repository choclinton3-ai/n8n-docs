import {
  Controller, Get, Patch, Delete, Body, Param,
  Query, UseGuards, Post,
} from '@nestjs/common'
import { UsersService } from './users.service'
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard'
import { RolesGuard } from '../common/guards/roles.guard'
import { Roles } from '../common/decorators/roles.decorator'
import { CurrentUser } from '../common/decorators/current-user.decorator'
import { UserRole } from '@prisma/client'

@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('me/addresses')
  getAddresses(@CurrentUser('id') userId: string) {
    return this.usersService.getAddresses(userId)
  }

  @Post('me/addresses')
  createAddress(@CurrentUser('id') userId: string, @Body() body: any) {
    return this.usersService.createAddress(userId, body)
  }

  @Delete('me/addresses/:id')
  deleteAddress(@CurrentUser('id') userId: string, @Param('id') id: string) {
    return this.usersService.deleteAddress(userId, id)
  }

  @Patch('me')
  updateProfile(@CurrentUser('id') userId: string, @Body() body: any) {
    return this.usersService.updateProfile(userId, body)
  }

  @Get()
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  findAll(@Query('page') page: string, @Query('limit') limit: string, @Query('search') search: string) {
    return this.usersService.findAll(+page || 1, +limit || 20, search)
  }

  @Get(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id)
  }

  @Patch(':id/toggle-status')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  toggleStatus(@Param('id') id: string, @CurrentUser('id') adminId: string) {
    return this.usersService.toggleStatus(id, adminId)
  }
}
