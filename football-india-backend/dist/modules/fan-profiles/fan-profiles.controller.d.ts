import { CreateFanProfileDto } from './dto/create-fan-profile.dto';
import { UpdateFanProfileDto } from './dto/update-fan-profile.dto';
import { FanProfilesService } from './fan-profiles.service';
export declare class FanProfilesController {
    private readonly fanProfilesService;
    constructor(fanProfilesService: FanProfilesService);
    findAll(): Promise<any[]>;
    findOne(id: string): Promise<any>;
    create(createFanProfileDto: CreateFanProfileDto): Promise<any>;
    update(id: string, updateFanProfileDto: UpdateFanProfileDto): Promise<any>;
}
