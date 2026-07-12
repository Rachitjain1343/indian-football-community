import { IsEmail, IsOptional, IsString, Matches, MaxLength, MinLength } from 'class-validator';
export class RegisterDto { @IsEmail() email!: string; @IsString() @MinLength(8) @MaxLength(72) password!: string; @IsOptional() @IsString() @MinLength(2) @MaxLength(100) fullName?: string; @IsOptional() @Matches(/^[a-zA-Z0-9_]{3,30}$/) username?: string }
