import { CanActivate, ExecutionContext, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { SupabaseClient } from '@supabase/supabase-js';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';
import { SUPABASE_ADMIN_CLIENT } from '../../database/supabase.client';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private reflector: Reflector, @Inject(SUPABASE_ADMIN_CLIENT) private supabase: SupabaseClient) {}
  async canActivate(ctx: ExecutionContext) {
    if (this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [ctx.getHandler(), ctx.getClass()])) return true;
    const req = ctx.switchToHttp().getRequest();
    const token = req.headers.authorization?.match(/^Bearer\s+(.+)$/i)?.[1];
    if (!token) throw new UnauthorizedException('Bearer token is required');
    const { data, error } = await this.supabase.auth.getUser(token);
    if (error || !data.user) throw new UnauthorizedException('Invalid or expired token');
    req.user = { id: data.user.id, email: data.user.email, role: data.user.app_metadata?.role || 'fan', user_metadata: data.user.user_metadata };
    req.accessToken = token;
    return true;
  }
}

