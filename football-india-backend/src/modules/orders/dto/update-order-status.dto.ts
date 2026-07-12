import { IsIn } from 'class-validator'; export class UpdateOrderStatusDto { @IsIn(['pending','confirmed','processing','shipped','delivered','cancelled','refunded']) status!: string }
