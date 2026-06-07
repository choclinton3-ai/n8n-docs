import { Injectable, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class PushService {
  private readonly logger = new Logger(PushService.name)
  private messaging: any = null

  constructor(private config: ConfigService) {
    const projectId = config.get('FIREBASE_PROJECT_ID')
    if (projectId) {
      try {
        const admin = require('firebase-admin')
        if (!admin.apps.length) {
          admin.initializeApp({
            credential: admin.credential.cert({
              projectId,
              clientEmail: config.get('FIREBASE_CLIENT_EMAIL'),
              privateKey: config.get('FIREBASE_PRIVATE_KEY')?.replace(/\\n/g, '\n'),
            }),
          })
        }
        this.messaging = admin.messaging()
        this.logger.log('Firebase push notifications configured')
      } catch {
        this.logger.warn('Firebase SDK not installed — push notifications disabled')
      }
    } else {
      this.logger.warn('Firebase not configured — push notifications disabled')
    }
  }

  async sendToToken(token: string, title: string, body: string, data?: Record<string, string>) {
    if (!this.messaging) {
      this.logger.log(`[PUSH NOT SENT] Token: ${token.slice(0, 20)}... | ${title}: ${body}`)
      return
    }
    try {
      await this.messaging.send({ token, notification: { title, body }, data })
      this.logger.log(`Push sent: ${title}`)
    } catch (error) {
      this.logger.error(`Push failed: ${error.message}`)
    }
  }

  async sendToTopic(topic: string, title: string, body: string) {
    if (!this.messaging) return
    try {
      await this.messaging.send({ topic, notification: { title, body } })
    } catch (error) {
      this.logger.error(`Topic push failed: ${error.message}`)
    }
  }
}
