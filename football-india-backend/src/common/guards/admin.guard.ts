import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
@Injectable()
export class AdminGuard implements CanActivate { canActivate(ctx: ExecutionContext) { if (ctx.switchToHttp().getRequest().user?.role !== 'admin') throw new ForbiddenException('Admin access required'); return true; } }

