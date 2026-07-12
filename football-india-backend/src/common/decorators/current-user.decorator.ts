import { createParamDecorator, ExecutionContext } from '@nestjs/common';
export interface AuthUser { id: string; email?: string; role: string; user_metadata?: Record<string, unknown> }
export const CurrentUser = createParamDecorator((_data: unknown, ctx: ExecutionContext): AuthUser => ctx.switchToHttp().getRequest().user);

