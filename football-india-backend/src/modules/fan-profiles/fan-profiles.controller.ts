import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { CreateFanProfileDto } from './dto/create-fan-profile.dto';
import { UpdateFanProfileDto } from './dto/update-fan-profile.dto';
import { FanProfilesService } from './fan-profiles.service';

@Controller('fan-profiles')
export class FanProfilesController {
  constructor(private readonly fanProfilesService: FanProfilesService) {}

  @Get()
  findAll() {
    return this.fanProfilesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.fanProfilesService.findOne(id);
  }

  @Post()
  create(@Body() createFanProfileDto: CreateFanProfileDto) {
    return this.fanProfilesService.create(createFanProfileDto);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateFanProfileDto: UpdateFanProfileDto,
  ) {
    return this.fanProfilesService.update(id, updateFanProfileDto);
  }
}
