import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common'
import { PrismaService } from '../common/prisma/prisma.service'
import { TicketStatus, TicketPriority, UserRole } from '@prisma/client'

@Injectable()
export class SupportService {
  constructor(private prisma: PrismaService) {}

  private ticketNo() {
    return `TKT-${Date.now().toString(36).toUpperCase()}`
  }

  async createTicket(userId: string, data: { subject: string; message: string; category?: string; priority?: TicketPriority }) {
    return this.prisma.supportTicket.create({
      data: { ...data, userId, ticketNo: this.ticketNo(), status: TicketStatus.OPEN },
    })
  }

  async findAll(page = 1, limit = 20, status?: TicketStatus, userId?: string, role?: UserRole) {
    const skip = (page - 1) * limit
    const where: any = {}
    if (role === UserRole.CUSTOMER && userId) where.userId = userId
    if (status) where.status = status

    const [data, total] = await Promise.all([
      this.prisma.supportTicket.findMany({
        where, skip, take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          user: { select: { id: true, firstName: true, lastName: true, email: true } },
          _count: { select: { replies: true } },
        },
      }),
      this.prisma.supportTicket.count({ where }),
    ])

    return { data, total, page, limit, totalPages: Math.ceil(total / limit) }
  }

  async findOne(id: string, userId: string, role: UserRole) {
    const ticket = await this.prisma.supportTicket.findUnique({
      where: { id },
      include: { replies: { orderBy: { createdAt: 'asc' } }, user: true },
    })
    if (!ticket) throw new NotFoundException('Ticket not found')
    if (role === UserRole.CUSTOMER && ticket.userId !== userId) throw new ForbiddenException()
    return ticket
  }

  async addReply(ticketId: string, authorId: string, message: string, isStaff: boolean) {
    const ticket = await this.prisma.supportTicket.findUnique({ where: { id: ticketId } })
    if (!ticket) throw new NotFoundException('Ticket not found')

    const reply = await this.prisma.ticketReply.create({
      data: { ticketId, authorId, message, isStaff },
    })

    if (ticket.status === TicketStatus.OPEN && isStaff) {
      await this.prisma.supportTicket.update({
        where: { id: ticketId },
        data: { status: TicketStatus.IN_PROGRESS },
      })
    }

    return reply
  }

  async updateStatus(id: string, status: TicketStatus, adminId: string) {
    if (!await this.prisma.supportTicket.findUnique({ where: { id } })) {
      throw new NotFoundException('Ticket not found')
    }
    return this.prisma.supportTicket.update({
      where: { id },
      data: { status, closedAt: status === TicketStatus.CLOSED ? new Date() : undefined },
    })
  }
}
