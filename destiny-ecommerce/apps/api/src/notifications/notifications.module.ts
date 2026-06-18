import { Module } from '@nestjs/common'
import { NotificationsService } from './notifications.service'
import { NotificationsController } from './notifications.controller'
import { EmailService } from './email.service'
import { SmsService } from './sms.service'
import { PushService } from './push.service'

@Module({
  providers: [NotificationsService, EmailService, SmsService, PushService],
  controllers: [NotificationsController],
  exports: [NotificationsService, EmailService, SmsService, PushService],
})
export class NotificationsModule {}
