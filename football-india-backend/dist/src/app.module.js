"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const auth_module_1 = require("./modules/auth/auth.module");
const users_module_1 = require("./modules/users/users.module");
const fan_profiles_module_1 = require("./modules/fan-profiles/fan-profiles.module");
const fan_cards_module_1 = require("./modules/fan-cards/fan-cards.module");
const clubs_module_1 = require("./modules/clubs/clubs.module");
const players_module_1 = require("./modules/players/players.module");
const national_teams_module_1 = require("./modules/national-teams/national-teams.module");
const leaderboard_module_1 = require("./modules/leaderboard/leaderboard.module");
const football_sync_module_1 = require("./modules/football-sync/football-sync.module");
const india_2034_module_1 = require("./modules/india-2034/india-2034.module");
const blogs_module_1 = require("./modules/blogs/blogs.module");
const blog_topics_module_1 = require("./modules/blog-topics/blog-topics.module");
const comments_module_1 = require("./modules/comments/comments.module");
const likes_module_1 = require("./modules/likes/likes.module");
const store_module_1 = require("./modules/store/store.module");
const cart_module_1 = require("./modules/cart/cart.module");
const orders_module_1 = require("./modules/orders/orders.module");
const payments_module_1 = require("./modules/payments/payments.module");
const badges_module_1 = require("./modules/badges/badges.module");
const notifications_module_1 = require("./modules/notifications/notifications.module");
const uploads_module_1 = require("./modules/uploads/uploads.module");
const admin_module_1 = require("./modules/admin/admin.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                envFilePath: '.env',
            }),
            auth_module_1.AuthModule,
            users_module_1.UsersModule,
            fan_profiles_module_1.FanProfilesModule,
            fan_cards_module_1.FanCardsModule,
            clubs_module_1.ClubsModule,
            players_module_1.PlayersModule,
            national_teams_module_1.NationalTeamsModule,
            leaderboard_module_1.LeaderboardModule,
            football_sync_module_1.FootballSyncModule,
            india_2034_module_1.India2034Module,
            blogs_module_1.BlogsModule,
            blog_topics_module_1.BlogTopicsModule,
            comments_module_1.CommentsModule,
            likes_module_1.LikesModule,
            store_module_1.StoreModule,
            cart_module_1.CartModule,
            orders_module_1.OrdersModule,
            payments_module_1.PaymentsModule,
            badges_module_1.BadgesModule,
            notifications_module_1.NotificationsModule,
            uploads_module_1.UploadsModule,
            admin_module_1.AdminModule,
        ],
        controllers: [],
        providers: [],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map