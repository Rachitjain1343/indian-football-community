import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { AuthUser, CurrentUser } from '../../common/decorators/current-user.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { RolesGuard } from '../../common/guards/roles.guard';
import { CreateFanProfileDto } from './dto/create-fan-profile.dto';
import { UpdateFanProfileDto } from './dto/update-fan-profile.dto';
import { FanProfilesService } from './fan-profiles.service';

@Controller('fan-profiles')
@UseGuards(RolesGuard)
export class FanProfilesController {
  constructor(private readonly fanProfilesService: FanProfilesService) {}

  @Get()
  @Roles('admin')
  findAll() {
    return this.fanProfilesService.findAll();
  }

  @Get('me/profile')
  findMine(@CurrentUser() user: AuthUser) { return this.fanProfilesService.findByUserId(user.id); }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.fanProfilesService.findOne(id);
  }

  @Post()
  @Roles('admin')
  create(@Body() createFanProfileDto: CreateFanProfileDto) {
    return this.fanProfilesService.create(createFanProfileDto);
  }

  @Patch('me/profile')
  updateMine(@CurrentUser() user: AuthUser, @Body() dto: UpdateFanProfileDto) { return this.fanProfilesService.updateByUserId(user.id, dto); }

  @Patch(':id')
  @Roles('admin')
  update(@Param('id') id: string, @Body() updateFanProfileDto: UpdateFanProfileDto) { return this.fanProfilesService.update(id, updateFanProfileDto); }
}
