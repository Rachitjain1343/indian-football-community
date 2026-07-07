"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FanProfilesController = void 0;
const common_1 = require("@nestjs/common");
const create_fan_profile_dto_1 = require("./dto/create-fan-profile.dto");
const update_fan_profile_dto_1 = require("./dto/update-fan-profile.dto");
const fan_profiles_service_1 = require("./fan-profiles.service");
let FanProfilesController = class FanProfilesController {
    constructor(fanProfilesService) {
        this.fanProfilesService = fanProfilesService;
    }
    findAll() {
        return this.fanProfilesService.findAll();
    }
    findOne(id) {
        return this.fanProfilesService.findOne(id);
    }
    create(createFanProfileDto) {
        return this.fanProfilesService.create(createFanProfileDto);
    }
    update(id, updateFanProfileDto) {
        return this.fanProfilesService.update(id, updateFanProfileDto);
    }
};
exports.FanProfilesController = FanProfilesController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], FanProfilesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], FanProfilesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_fan_profile_dto_1.CreateFanProfileDto]),
    __metadata("design:returntype", void 0)
], FanProfilesController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_fan_profile_dto_1.UpdateFanProfileDto]),
    __metadata("design:returntype", void 0)
], FanProfilesController.prototype, "update", null);
exports.FanProfilesController = FanProfilesController = __decorate([
    (0, common_1.Controller)('fan-profiles'),
    __metadata("design:paramtypes", [fan_profiles_service_1.FanProfilesService])
], FanProfilesController);
//# sourceMappingURL=fan-profiles.controller.js.map