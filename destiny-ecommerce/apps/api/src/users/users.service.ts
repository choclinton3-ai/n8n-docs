import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common'
import { PrismaService } from '../common/prisma/prisma.service'
import { UserRole } from '@prisma/client'
import * as bcrypt from 'bcryptjs'

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findAll(page = 1, limit = 20, search?: string) {
    const skip = (page - 1) * limit
    const where = search
      ? {
          OR: [
            { email: { contains: search, mode: 'insensitive' as const } },
            { firstName: { contains: search, mode: 'insensitive' as const } },
            { lastName: { contains: search, mode: 'insensitive' as const } },
          ],
        }
      : {}

    const [data, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true, email: true, firstName: true, lastName: true,
          phone: true, role: true, isActive: true, emailVerified: true,
          avatar: true, lastLogin: true, createdAt: true,
          _count: { select: { orders: true } },
        },
      }),
      this.prisma.user.count({ where }),
    ])

    return { data, total, page, limit, totalPages: Math.ceil(total / limit) }
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true, email: true, firstName: true, lastName: true,
        phone: true, role: true, isActive: true, emailVerified: true,
        avatar: true, lastLogin: true, createdAt: true,
        addresses: true,
        _count: { select: { orders: true, reviews: true } },
      },
    })
    if (!user) throw new NotFoundException('User not found')
    return user
  }

  async updateProfile(userId: string, data: {
    firstName?: string; lastName?: string; phone?: string; avatar?: string
  }) {
    return this.prisma.user.update({
      where: { id: userId },
      data,
      select: {
        id: true, email: true, firstName: true, lastName: true,
        phone: true, avatar: true, role: true,
      },
    })
  }

  async toggleStatus(id: string, adminId: string) {
    const user = await this.prisma.user.findUnique({ where: { id } })
    if (!user) throw new NotFoundException('User not found')
    if (user.role === UserRole.SUPER_ADMIN) throw new ForbiddenException('Cannot deactivate super admin')

    const updated = await this.prisma.user.update({
      where: { id },
      data: { isActive: !user.isActive },
      select: { id: true, isActive: true },
    })

    await this.prisma.auditLog.create({
      data: {
        userId: adminId, action: updated.isActive ? 'ACTIVATE_USER' : 'DEACTIVATE_USER',
        resource: 'user', resourceId: id,
      },
    })

    return updated
  }

  async getAddresses(userId: string) {
    return this.prisma.address.findMany({
      where: { userId },
      orderBy: [{ isDefault: 'desc' }, { createdAt: 'desc' }],
    })
  }

  async createAddress(userId: string, data: {
    label?: string; firstName: string; lastName: string; phone: string;
    street: string; city: string; region: string; country?: string; isDefault?: boolean
  }) {
    if (data.isDefault) {
      await this.prisma.address.updateMany({
        where: { userId },
        data: { isDefault: false },
      })
    }
    return this.prisma.address.create({ data: { ...data, userId } })
  }

  async deleteAddress(userId: string, addressId: string) {
    const address = await this.prisma.address.findFirst({ where: { id: addressId, userId } })
    if (!address) throw new NotFoundException('Address not found')
    await this.prisma.address.delete({ where: { id: addressId } })
    return { message: 'Address removed' }
  }
}
