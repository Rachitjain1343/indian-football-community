import { BadRequestException, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import { SUPABASE_ADMIN_CLIENT, SUPABASE_PUBLIC_CLIENT } from '../../database/supabase.client';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(@Inject(SUPABASE_PUBLIC_CLIENT) private publicClient: SupabaseClient, @Inject(SUPABASE_ADMIN_CLIENT) private admin: SupabaseClient) {}
  async register(dto: RegisterDto) {
    const email = this.normalizeEmail(dto.email);
    const fullName = dto.fullName?.trim() || this.defaultDisplayName(email);
    const username = dto.username?.trim() || undefined;
    if (!email.includes('@') || dto.password?.length < 8) throw new BadRequestException('A valid email and password of at least 8 characters are required');
    const created = await this.admin.auth.admin.createUser({
      email,
      password: dto.password,
      email_confirm: true,
      user_metadata: { full_name: fullName, username },
    });
    if (created.error || !created.data.user) throw new BadRequestException(created.error?.message || 'Unable to create account');

    const profile = await this.admin.from('fan_profiles').upsert({ user_id: created.data.user.id, full_name: fullName, username: username || null }, { onConflict: 'user_id' });
    if (profile.error) {
      await this.admin.auth.admin.deleteUser(created.data.user.id);
      throw new BadRequestException(profile.error.message);
    }

    const signIn = await this.publicClient.auth.signInWithPassword({ email, password: dto.password });
    if (signIn.error || !signIn.data.user || !signIn.data.session) {
      throw new BadRequestException(signIn.error?.message || 'Account created, but automatic sign-in failed');
    }

    return { user: signIn.data.user, session: signIn.data.session, emailConfirmationRequired: false };
  }
  async login(email: string, password: string) { if (!email || !password) throw new BadRequestException('Email and password are required'); const { data, error } = await this.publicClient.auth.signInWithPassword({ email: this.normalizeEmail(email), password }); if (error) throw new UnauthorizedException(error.message); return data; }
  async refresh(refreshToken: string) { const { data, error } = await this.publicClient.auth.refreshSession({ refresh_token: refreshToken }); if (error) throw new UnauthorizedException(error.message); return data; }
  async forgotPassword(email: string) { const redirectTo = process.env.PASSWORD_RESET_REDIRECT_URL; const { error } = await this.publicClient.auth.resetPasswordForEmail(this.normalizeEmail(email), redirectTo ? { redirectTo } : undefined); if (error) throw new BadRequestException(error.message); return { message: 'If the account exists, a reset link has been sent.' }; }
  async resendConfirmation(email: string) {
    const redirectTo = process.env.EMAIL_CONFIRMATION_REDIRECT_URL || process.env.FRONTEND_URL?.split(',')[0]?.trim();
    const { error } = await this.publicClient.auth.resend({ type: 'signup', email: this.normalizeEmail(email), options: redirectTo ? { emailRedirectTo: redirectTo } : undefined });
    if (error) throw new BadRequestException(error.message);
    return { message: 'If the account exists, a fresh confirmation email has been sent.' };
  }
  async resetPassword(accessToken: string, password: string) { const { data, error } = await this.admin.auth.getUser(accessToken); if (error || !data.user) throw new UnauthorizedException('Invalid or expired recovery token'); const result = await this.admin.auth.admin.updateUserById(data.user.id, { password }); if (result.error) throw new BadRequestException(result.error.message); return { message: 'Password updated successfully' }; }
  async logout(accessToken: string) { const { error } = await this.admin.auth.admin.signOut(accessToken); if (error) throw new BadRequestException(error.message); return { message: 'Logged out successfully' }; }

  private normalizeEmail(email: string) {
    return email.trim().toLowerCase();
  }

  private defaultDisplayName(email: string) {
    const localPart = email.split('@')[0] || 'supporter';
    return localPart.replace(/[._-]+/g, ' ').trim().slice(0, 100) || 'supporter';
  }
}

