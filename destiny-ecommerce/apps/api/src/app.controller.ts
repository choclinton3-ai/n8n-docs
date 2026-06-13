import { Controller, Get } from '@nestjs/common'
import { Public } from './common/decorators/roles.decorator'

@Controller()
export class AppController {
  @Public()
  @Get('health')
  health() {
    return { status: 'ok', timestamp: new Date().toISOString(), service: 'Destiny E-Commerce API' }
  }
}
