import { IsNotEmptyObject, IsObject } from 'class-validator'; export class CreateOrderDto { @IsObject() @IsNotEmptyObject() shippingAddress!: Record<string, unknown> }
