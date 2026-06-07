import { Controller, Get, Post, Patch, Body, Param, Query, UseGuards } from '@nestjs/common'
import { SupportService } from './support.service'
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard'
import { RolesGuard } from '../common/guards/roles.guard'
import { Roles } from '../common/decorators/roles.decorator'
import { CurrentUser } from '../common/decorators/current-user.decorator'
import { UserRole, TicketStatus } from '@prisma/client'

@UseGuards(JwtAuthGuard)
@Controller('support')
export class SupportController {
  constructor(private supportService: SupportService) {}

  @Post('tickets')
  createTicket(@CurrentUser('id') userId: string, @Body() body: any) {
    return this.supportService.createTicket(userId, body)
  }

  @Get('tickets')
  findAll(
    @CurrentUser('id') userId: string,
    @CurrentUser('role') role: UserRole,
    @Query('page') page: string,
    @Query('limit') limit: string,
    @Query('status') status: string,
  ) {
    return this.supportService.findAll(+page || 1, +limit || 20, status as TicketStatus, userId, role)
  }

  @Get('tickets/:id')
  findOne(@Param('id') id: string, @CurrentUser('id') userId: string, @CurrentUser('role') role: UserRole) {
    return this.supportService.findOne(id, userId, role)
  }

  @Post('tickets/:id/reply')
  reply(
    @Param('id') id: string,
    @CurrentUser('id') authorId: string,
    @CurrentUser('role') role: UserRole,
    @Body() body: { message: string },
  ) {
    const isStaff = [UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.SUPPORT].includes(role)
    return this.supportService.addReply(id, authorId, body.message, isStaff)
  }

  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.SUPPORT)
  @Patch('tickets/:id/status')
  updateStatus(@Param('id') id: string, @Body() body: { status: TicketStatus }, @CurrentUser('id') adminId: string) {
    return this.supportService.updateStatus(id, body.status, adminId)
  }
}
