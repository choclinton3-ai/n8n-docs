import { Injectable, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

export interface MtnPaymentRequest {
  amount: number
  currency: string
  externalId: string
  payer: { partyIdType: 'MSISDN'; partyId: string }
  payerMessage?: string
  payeeNote?: string
}

@Injectable()
export class MtnMomoService {
  private readonly logger = new Logger(MtnMomoService.name)
  private readonly merchantNumber = '653526767'
  private readonly ussdCode = '*126*4*1*653526767*AMOUNT#'

  constructor(private config: ConfigService) {}

  getPaymentInstructions(amount: number, orderNumber: string): {
    method: string; number: string; ussd: string; instructions: string[]
  } {
    return {
      method: 'MTN Mobile Money',
      number: this.merchantNumber,
      ussd: `*126*4*1*${this.merchantNumber}*${amount}#`,
      instructions: [
        `Dial *126*4*1*${this.merchantNumber}*${amount}# on your MTN line`,
        `OR open MTN MoMo app → Send Money → Enter ${this.merchantNumber}`,
        `Enter amount: ${amount.toLocaleString()} FCFA`,
        `Reference/Note: ${orderNumber}`,
        `Enter your MoMo PIN to confirm`,
        `Copy the transaction ID from the confirmation SMS`,
        `Submit the transaction ID below to confirm your order`,
      ],
    }
  }

  async initiatePayment(req: MtnPaymentRequest): Promise<{ reference: string; status: string }> {
    const apiKey = this.config.get('MTN_MOMO_API_KEY')
    if (!apiKey) {
      this.logger.warn('MTN MoMo API not configured — using manual verification mode')
      return { reference: `MANUAL-${req.externalId}`, status: 'PENDING_MANUAL' }
    }

    this.logger.log(`MTN MoMo API request for ${req.amount} FCFA to ${req.payer.partyId}`)
    return { reference: req.externalId, status: 'PENDING' }
  }

  async checkStatus(reference: string): Promise<{ status: string; reason?: string }> {
    const apiKey = this.config.get('MTN_MOMO_API_KEY')
    if (!apiKey) return { status: 'MANUAL_VERIFICATION_REQUIRED' }
    return { status: 'PENDING' }
  }
}
