import { IsString, IsArray, IsOptional, IsNumber, IsEnum, ValidateNested } from 'class-validator'
import { Type } from 'class-transformer'
import { PaymentMethod } from '@prisma/client'

export class OrderItemDto {
  @IsString()
  productId: string

  @IsOptional()
  @IsString()
  variantId?: string

  @IsNumber()
  quantity: number
}

export class CreateOrderDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[]

  @IsEnum(PaymentMethod)
  paymentMethod: PaymentMethod

  @IsOptional()
  @IsString()
  shippingAddressId?: string

  @IsOptional()
  shippingAddress?: {
    firstName: string; lastName: string; phone: string
    street: string; city: string; region: string; country?: string
  }

  @IsOptional()
  @IsString()
  couponCode?: string

  @IsOptional()
  @IsString()
  notes?: string
}

export class VerifyPaymentDto {
  @IsString()
  orderId: string

  @IsString()
  transactionId: string

  @IsString()
  senderNumber: string

  @IsNumber()
  amount: number

  @IsOptional()
  @IsString()
  screenshotUrl?: string
}

export class UpdateOrderStatusDto {
  @IsString()
  status: string

  @IsOptional()
  @IsString()
  note?: string

  @IsOptional()
  @IsString()
  trackingNumber?: string
}
