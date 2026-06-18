import { Module } from '@nestjs/common'
import { PaymentsService } from './payments.service'
import { PaymentsController } from './payments.controller'
import { MtnMomoService } from './gateways/mtn-momo.service'
import { OrangeMoneyService } from './gateways/orange-money.service'

@Module({
  providers: [PaymentsService, MtnMomoService, OrangeMoneyService],
  controllers: [PaymentsController],
  exports: [PaymentsService, MtnMomoService, OrangeMoneyService],
})
export class PaymentsModule {}
