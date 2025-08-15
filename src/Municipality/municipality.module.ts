import { Module } from '@nestjs/common';
import { municipalityService } from './municipality.service';
import { MunicipalityController } from './controllers/municipality.controller';

@Module({
  controllers: [MunicipalityController],
  providers: [municipalityService],
})
export class MunicipalityModule {}
