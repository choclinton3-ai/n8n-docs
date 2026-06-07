import { Injectable, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class SmsService {
  private readonly logger = new Logger(SmsService.name)
  private client: any = null

  constructor(private config: ConfigService) {
    const apiKey = config.get('AT_API_KEY')
    const username = config.get('AT_USERNAME')
    if (apiKey && username) {
      try {
        const AfricasTalking = require('africastalking')
        const at = AfricasTalking({ apiKey, username })
        this.client = at.SMS
        this.logger.log("Africa's Talking SMS configured")
      } catch {
        this.logger.warn("Africa's Talking SDK not installed — SMS disabled")
      }
    } else {
      this.logger.warn('SMS not configured — messages will be logged only')
    }
  }

  async send(to: string, message: string) {
    if (!this.client) {
      this.logger.log(`[SMS NOT SENT] To: ${to} | Message: ${message}`)
      return
    }
    try {
      await this.client.send({ to: [to], message, from: this.config.get('AT_SENDER_ID') || 'Destiny' })
      this.logger.log(`SMS sent to ${to}`)
    } catch (error) {
      this.logger.error(`SMS failed to ${to}: ${error.message}`)
    }
  }

  async sendOrderConfirmation(phone: string, orderNumber: string, total: number) {
    await this.send(phone, `Destiny: Order ${orderNumber} received. Total: ${total.toLocaleString()} FCFA. Submit payment proof at destinyecommerce.cm`)
  }

  async sendPaymentVerified(phone: string, orderNumber: string) {
    await this.send(phone, `Destiny: Payment for order ${orderNumber} verified! Your order is now processing. Thank you!`)
  }

  async sendOtp(phone: string, otp: string) {
    await this.send(phone, `Destiny OTP: ${otp}. Valid for 10 minutes. Do not share this code.`)
  }
}
