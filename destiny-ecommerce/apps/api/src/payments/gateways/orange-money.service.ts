import { Injectable, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class OrangeMoneyService {
  private readonly logger = new Logger(OrangeMoneyService.name)
  private readonly merchantNumber = '640638536'
  private readonly merchantName = 'Cho Clinton Teneng'

  constructor(private config: ConfigService) {}

  getPaymentInstructions(amount: number, orderNumber: string): {
    method: string; number: string; accountName: string; instructions: string[]
  } {
    return {
      method: 'Orange Money',
      number: this.merchantNumber,
      accountName: this.merchantName,
      instructions: [
        `Dial #150*1# on your Orange line`,
        `OR open Orange Money app → Paiement Marchand → Enter ${this.merchantNumber}`,
        `Account Name: ${this.merchantName}`,
        `Enter amount: ${amount.toLocaleString()} FCFA`,
        `Reference/Note: ${orderNumber}`,
        `Enter your Orange Money PIN to confirm`,
        `Copy the transaction ID from the confirmation SMS`,
        `Submit the transaction ID below to confirm your order`,
      ],
    }
  }

  async initiatePayment(amount: number, phone: string, orderId: string): Promise<{ reference: string; status: string }> {
    const apiKey = this.config.get('ORANGE_CLIENT_ID')
    if (!apiKey) {
      this.logger.warn('Orange Money API not configured — using manual verification mode')
      return { reference: `OM-MANUAL-${orderId}`, status: 'PENDING_MANUAL' }
    }
    return { reference: orderId, status: 'PENDING' }
  }
}
