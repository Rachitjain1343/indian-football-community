import { IsInt, IsUUID, Max, Min } from 'class-validator'; export class AddToCartDto { @IsUUID() productId!: string; @IsInt() @Min(1) @Max(20) quantity: number = 1 }
