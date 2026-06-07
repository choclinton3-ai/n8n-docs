import {
  Injectable, BadRequestException, UnauthorizedException,
  ConflictException, NotFoundException, Logger,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'
import { PrismaService } from '../common/prisma/prisma.service'
import { RegisterDto } from './dto/register.dto'
import { LoginDto, ForgotPasswordDto, ResetPasswordDto, ChangePasswordDto } from './dto/login.dto'
import * as bcrypt from 'bcryptjs'
import * as crypto from 'crypto'
import { UserRole } from '@prisma/client'

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name)

  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  async register(dto: RegisterDto) {
    const exists = await this.prisma.user.findUnique({ where: { email: dto.email } })
    if (exists) throw new ConflictException('Email already registered')

    const hashed = await bcrypt.hash(dto.password, 12)
    const verifyToken = crypto.randomBytes(32).toString('hex')

    const user = await this.prisma.user.create({
      data: {
        email: dto.email.toLowerCase(),
        firstName: dto.firstName,
        lastName: dto.lastName,
        password: hashed,
        phone: dto.phone,
        role: UserRole.CUSTOMER,
      },
      select: { id: true, email: true, firstName: true, lastName: true, role: true },
    })

    const tokens = await this.generateTokens(user.id, user.email, user.role)

    await this.prisma.auditLog.create({
      data: { userId: user.id, action: 'REGISTER', resource: 'user', resourceId: user.id },
    })

    return { user, ...tokens, message: 'Registration successful. Please verify your email.' }
  }

  async login(dto: LoginDto, ipAddress?: string, userAgent?: string) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email.toLowerCase() },
    })

    if (!user || !user.password) throw new UnauthorizedException('Invalid credentials')
    if (!user.isActive) throw new UnauthorizedException('Account suspended')

    const valid = await bcrypt.compare(dto.password, user.password)
    if (!valid) throw new UnauthorizedException('Invalid credentials')

    await this.prisma.user.update({
      where: { id: user.id },
      data: { lastLogin: new Date() },
    })

    const tokens = await this.generateTokens(user.id, user.email, user.role)

    await this.prisma.auditLog.create({
      data: {
        userId: user.id, action: 'LOGIN', resource: 'user',
        resourceId: user.id, ipAddress, userAgent,
      },
    })

    return {
      user: {
        id: user.id, email: user.email, firstName: user.firstName,
        lastName: user.lastName, role: user.role, avatar: user.avatar,
        emailVerified: user.emailVerified,
      },
      ...tokens,
    }
  }

  async refreshToken(token: string) {
    const stored = await this.prisma.refreshToken.findUnique({ where: { token } })
    if (!stored || stored.expiresAt < new Date()) {
      if (stored) await this.prisma.refreshToken.delete({ where: { token } })
      throw new UnauthorizedException('Invalid or expired refresh token')
    }

    const user = await this.prisma.user.findUnique({ where: { id: stored.userId } })
    if (!user || !user.isActive) throw new UnauthorizedException('Account not found')

    await this.prisma.refreshToken.delete({ where: { token } })
    return this.generateTokens(user.id, user.email, user.role)
  }

  async logout(userId: string, refreshToken?: string) {
    if (refreshToken) {
      await this.prisma.refreshToken.deleteMany({ where: { token: refreshToken } })
    }
    await this.prisma.auditLog.create({
      data: { userId, action: 'LOGOUT', resource: 'user', resourceId: userId },
    })
    return { message: 'Logged out successfully' }
  }

  async forgotPassword(dto: ForgotPasswordDto) {
    const user = await this.prisma.user.findUnique({ where: { email: dto.email.toLowerCase() } })
    if (!user) return { message: 'If this email exists, a reset link has been sent.' }

    const token = crypto.randomBytes(32).toString('hex')
    const expires = new Date(Date.now() + 2 * 60 * 60 * 1000)

    await this.prisma.session.create({
      data: {
        userId: user.id,
        token: `reset:${token}`,
        expiresAt: expires,
      },
    })

    this.logger.log(`Password reset token for ${user.email}: ${token}`)
    return { message: 'Password reset link sent to your email.' }
  }

  async resetPassword(dto: ResetPasswordDto) {
    const session = await this.prisma.session.findUnique({
      where: { token: `reset:${dto.token}` },
    })

    if (!session || session.expiresAt < new Date()) {
      if (session) await this.prisma.session.delete({ where: { id: session.id } })
      throw new BadRequestException('Reset token is invalid or expired')
    }

    const hashed = await bcrypt.hash(dto.password, 12)
    await this.prisma.user.update({
      where: { id: session.userId },
      data: { password: hashed },
    })
    await this.prisma.session.delete({ where: { id: session.id } })
    await this.prisma.refreshToken.deleteMany({ where: { userId: session.userId } })

    return { message: 'Password reset successfully. Please log in.' }
  }

  async changePassword(userId: string, dto: ChangePasswordDto) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } })
    if (!user?.password) throw new BadRequestException('No password set on this account')

    const valid = await bcrypt.compare(dto.currentPassword, user.password)
    if (!valid) throw new UnauthorizedException('Current password is incorrect')

    const hashed = await bcrypt.hash(dto.newPassword, 12)
    await this.prisma.user.update({ where: { id: userId }, data: { password: hashed } })
    await this.prisma.refreshToken.deleteMany({ where: { userId } })

    return { message: 'Password changed successfully' }
  }

  async getMe(userId: string) {
    return this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true, email: true, firstName: true, lastName: true,
        phone: true, avatar: true, role: true, emailVerified: true,
        phoneVerified: true, createdAt: true,
      },
    })
  }

  private async generateTokens(userId: string, email: string, role: string) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwt.signAsync(
        { sub: userId, email, role },
        { secret: this.config.get('JWT_SECRET'), expiresIn: this.config.get('JWT_EXPIRY', '15m') },
      ),
      this.jwt.signAsync(
        { sub: userId },
        { secret: this.config.get('JWT_REFRESH_SECRET', this.config.get('JWT_SECRET')), expiresIn: '7d' },
      ),
    ])

    await this.prisma.refreshToken.create({
      data: {
        userId,
        token: refreshToken,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    })

    return { accessToken, refreshToken }
  }
}
