import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { FanProfilesModule } from './modules/fan-profiles/fan-profiles.module';
import { FanCardsModule } from './modules/fan-cards/fan-cards.module';
import { ClubsModule } from './modules/clubs/clubs.module';
import { PlayersModule } from './modules/players/players.module';
import { NationalTeamsModule } from './modules/national-teams/national-teams.module';
import { LeaderboardModule } from './modules/leaderboard/leaderboard.module';
import { FootballSyncModule } from './modules/football-sync/football-sync.module';
import { India2034Module } from './modules/india-2034/india-2034.module';
import { BlogsModule } from './modules/blogs/blogs.module';
import { BlogTopicsModule } from './modules/blog-topics/blog-topics.module';
import { CommentsModule } from './modules/comments/comments.module';
import { LikesModule } from './modules/likes/likes.module';
import { StoreModule } from './modules/store/store.module';
import { CartModule } from './modules/cart/cart.module';
import { OrdersModule } from './modules/orders/orders.module';
import { PaymentsModule } from './modules/payments/payments.module';
import { BadgesModule } from './modules/badges/badges.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { UploadsModule } from './modules/uploads/uploads.module';
import { AdminModule } from './modules/admin/admin.module';
import { DatabaseModule } from './database/database.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { HealthController } from './health.controller';
import { validateEnv } from './config/env.validation';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      validate: validateEnv,
    }),
    DatabaseModule,
    ThrottlerModule.forRoot([{ ttl: 60000, limit: 100 }]),
    AuthModule,
    UsersModule,
    FanProfilesModule,
    FanCardsModule,
    ClubsModule,
    PlayersModule,
    NationalTeamsModule,
    LeaderboardModule,
    FootballSyncModule,
    India2034Module,
    BlogsModule,
    BlogTopicsModule,
    CommentsModule,
    LikesModule,
    StoreModule,
    CartModule,
    OrdersModule,
    PaymentsModule,
    BadgesModule,
    NotificationsModule,
    UploadsModule,
    AdminModule,
  ],
  controllers: [HealthController],
  providers: [{ provide: APP_GUARD, useClass: ThrottlerGuard }, { provide: APP_GUARD, useClass: JwtAuthGuard }],
})
export class AppModule {}
