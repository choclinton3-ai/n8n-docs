import { NestFactory } from '@nestjs/core'
import { ValidationPipe, Logger } from '@nestjs/common'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'
import { ConfigService } from '@nestjs/config'
import helmet from 'helmet'
import compression from 'compression'
import { AppModule } from './app.module'

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['log', 'error', 'warn', 'debug'],
  })

  const configService = app.get(ConfigService)
  const logger = new Logger('Bootstrap')

  // Security
  app.use(helmet({ crossOriginEmbedderPolicy: false }))
  app.use(compression())

  // CORS
  app.enableCors({
    origin: [
      configService.get('FRONTEND_URL', 'http://localhost:3000'),
      configService.get('ADMIN_URL', 'http://localhost:3001'),
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  })

  // Global prefix
  app.setGlobalPrefix('api/v1')

  // Validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  )

  // Swagger API Docs
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Destiny E-Commerce API')
    .setDescription('Enterprise-grade e-commerce API for Cameroon\'s #1 electronics marketplace')
    .setVersion('1.0.0')
    .addBearerAuth()
    .addTag('auth', 'Authentication endpoints')
    .addTag('products', 'Product management')
    .addTag('orders', 'Order management')
    .addTag('users', 'User management')
    .addTag('payments', 'Payment processing')
    .addTag('vendors', 'Vendor management')
    .addTag('admin', 'Admin operations')
    .addTag('analytics', 'Analytics & reporting')
    .build()

  const document = SwaggerModule.createDocument(app, swaggerConfig)
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: { persistAuthorization: true },
    customSiteTitle: 'Destiny E-Commerce API',
  })

  const port = configService.get<number>('PORT', 5000)
  await app.listen(port)

  logger.log(`🚀 Destiny E-Commerce API running on: http://localhost:${port}/api/v1`)
  logger.log(`📚 API Docs available at: http://localhost:${port}/api/docs`)
}

bootstrap()
