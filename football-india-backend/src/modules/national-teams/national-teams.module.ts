import { Module } from '@nestjs/common';

import { NationalTeamsController } from './national-teams.controller'; import { NationalTeamsService } from './national-teams.service';
@Module({controllers:[NationalTeamsController],providers:[NationalTeamsService]})
export class NationalTeamsModule {}
