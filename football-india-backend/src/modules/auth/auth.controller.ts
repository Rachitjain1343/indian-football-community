import { Body, Controller, Post, Req } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { Public } from '../../common/decorators/public.decorator';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto'; import { LoginDto } from './dto/login.dto'; import { RefreshTokenDto } from './dto/refresh-token.dto'; import { ForgotPasswordDto } from './dto/forgot-password.dto'; import { ResetPasswordDto } from './dto/reset-password.dto';
@Controller('auth')
export class AuthController {
  constructor(private service: AuthService) {}
  @Public() @Throttle({ default: { limit: 3, ttl: 300000 } }) @Post('register') register(@Body() dto: RegisterDto) { return this.service.register(dto); }
  @Public() @Throttle({ default: { limit: 20, ttl: 60000 } }) @Post('login') login(@Body() dto: LoginDto) { return this.service.login(dto.email, dto.password); }
  @Public() @Post('refresh') refresh(@Body() dto: RefreshTokenDto) { return this.service.refresh(dto.refreshToken); }
  @Public() @Throttle({ default: { limit: 3, ttl: 300000 } }) @Post('forgot-password') forgot(@Body() dto: ForgotPasswordDto) { return this.service.forgotPassword(dto.email); }
  @Public() @Throttle({ default: { limit: 3, ttl: 300000 } }) @Post('resend-confirmation') resend(@Body() dto: ForgotPasswordDto) { return this.service.resendConfirmation(dto.email); }
  @Public() @Post('reset-password') reset(@Body() dto: ResetPasswordDto) { return this.service.resetPassword(dto.accessToken, dto.password); }
  @Post('logout') logout(@Req() req: any) { return this.service.logout(req.accessToken); }
}

