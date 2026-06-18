import { Injectable, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import * as nodemailer from 'nodemailer'

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name)
  private transporter: nodemailer.Transporter | null = null

  constructor(private config: ConfigService) {
    const host = config.get('SMTP_HOST')
    if (host) {
      this.transporter = nodemailer.createTransport({
        host,
        port: config.get<number>('SMTP_PORT', 587),
        secure: config.get('SMTP_PORT', '587') === '465',
        auth: { user: config.get('SMTP_USER'), pass: config.get('SMTP_PASS') },
      })
    } else {
      this.logger.warn('SMTP not configured — emails will be logged only')
    }
  }

  private brandedTemplate(title: string, content: string): string {
    return `
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="font-family:-apple-system,BlinkMacSystemFont,Segoe UI,sans-serif;background:#f5f5f5;margin:0;padding:20px">
  <div style="max-width:600px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 4px 12px rgba(0,0,0,0.1)">
    <div style="background:linear-gradient(135deg,#FF007F,#E60073);padding:24px 32px">
      <h1 style="color:#fff;margin:0;font-size:24px;font-weight:900">DESTINY E-COMMERCE</h1>
      <p style="color:rgba(255,255,255,0.8);margin:4px 0 0;font-size:13px">Your Success, Our Destiny</p>
    </div>
    <div style="padding:32px">
      <h2 style="color:#1a1a1a;margin-top:0">${title}</h2>
      ${content}
    </div>
    <div style="background:#f9f9f9;padding:16px 32px;text-align:center;font-size:12px;color:#999">
      © ${new Date().getFullYear()} Destiny E-Commerce · destinyecommerce.cm
    </div>
  </div>
</body>
</html>`
  }

  async send(to: string, subject: string, html: string) {
    if (!this.transporter) {
      this.logger.log(`[EMAIL NOT SENT - no SMTP] To: ${to} | Subject: ${subject}`)
      return
    }
    try {
      await this.transporter.sendMail({
        from: `"Destiny E-Commerce" <${this.config.get('SMTP_USER')}>`,
        to, subject, html,
      })
      this.logger.log(`Email sent to ${to}: ${subject}`)
    } catch (error) {
      this.logger.error(`Failed to send email to ${to}: ${error.message}`)
    }
  }

  async sendWelcome(to: string, firstName: string) {
    await this.send(
      to,
      'Welcome to Destiny E-Commerce! 🎉',
      this.brandedTemplate('Welcome, ' + firstName + '!', `
        <p style="color:#555">Your account has been created successfully.</p>
        <p style="color:#555">Start exploring thousands of electronics at the best prices in Cameroon.</p>
        <a href="https://destinyecommerce.cm/shop" style="display:inline-block;background:#FF007F;color:#fff;padding:12px 28px;border-radius:8px;text-decoration:none;font-weight:700;margin-top:16px">Start Shopping</a>
      `),
    )
  }

  async sendOrderConfirmation(to: string, firstName: string, orderNumber: string, total: number) {
    await this.send(
      to,
      `Order Confirmed — ${orderNumber}`,
      this.brandedTemplate('Order Received!', `
        <p style="color:#555">Hi ${firstName}, we've received your order.</p>
        <div style="background:#f9f9f9;border-radius:8px;padding:16px;margin:16px 0">
          <p style="margin:0;font-size:14px;color:#999">Order Number</p>
          <p style="margin:4px 0 0;font-size:20px;font-weight:900;color:#FF007F">${orderNumber}</p>
          <p style="margin:12px 0 0;font-size:14px;color:#999">Total</p>
          <p style="margin:4px 0 0;font-size:18px;font-weight:700;color:#1a1a1a">${total.toLocaleString()} FCFA</p>
        </div>
        <p style="color:#555">Please submit your payment proof to complete your order. An admin will verify within 30 minutes.</p>
      `),
    )
  }

  async sendPaymentVerified(to: string, firstName: string, orderNumber: string) {
    await this.send(
      to,
      `Payment Verified — ${orderNumber} ✅`,
      this.brandedTemplate('Payment Confirmed!', `
        <p style="color:#555">Hi ${firstName}, your payment for order <strong>${orderNumber}</strong> has been verified.</p>
        <p style="color:#555">Your order is now being processed and will be shipped soon.</p>
      `),
    )
  }

  async sendOrderShipped(to: string, firstName: string, orderNumber: string, trackingNumber?: string) {
    await this.send(
      to,
      `Your order is on its way! 🚀 — ${orderNumber}`,
      this.brandedTemplate('Order Shipped!', `
        <p style="color:#555">Hi ${firstName}, your order <strong>${orderNumber}</strong> has been shipped!</p>
        ${trackingNumber ? `<p style="color:#555">Tracking Number: <strong>${trackingNumber}</strong></p>` : ''}
      `),
    )
  }

  async sendPasswordReset(to: string, firstName: string, resetLink: string) {
    await this.send(
      to,
      'Reset Your Password',
      this.brandedTemplate('Password Reset Request', `
        <p style="color:#555">Hi ${firstName}, you requested a password reset.</p>
        <a href="${resetLink}" style="display:inline-block;background:#FF007F;color:#fff;padding:12px 28px;border-radius:8px;text-decoration:none;font-weight:700;margin:16px 0">Reset Password</a>
        <p style="color:#999;font-size:13px">This link expires in 2 hours. If you didn't request this, ignore this email.</p>
      `),
    )
  }
}
