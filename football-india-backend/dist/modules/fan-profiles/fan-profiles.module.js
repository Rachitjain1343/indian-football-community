"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FanProfilesModule = void 0;
const common_1 = require("@nestjs/common");
const supabase_client_1 = require("../../database/supabase.client");
const fan_profiles_controller_1 = require("./fan-profiles.controller");
const fan_profiles_service_1 = require("./fan-profiles.service");
let FanProfilesModule = class FanProfilesModule {
};
exports.FanProfilesModule = FanProfilesModule;
exports.FanProfilesModule = FanProfilesModule = __decorate([
    (0, common_1.Module)({
        controllers: [fan_profiles_controller_1.FanProfilesController],
        providers: [
            fan_profiles_service_1.FanProfilesService,
            {
                provide: supabase_client_1.SUPABASE_ADMIN_CLIENT,
                useFactory: supabase_client_1.createSupabaseAdminClient,
            },
        ],
    })
], FanProfilesModule);
//# sourceMappingURL=fan-profiles.module.js.map