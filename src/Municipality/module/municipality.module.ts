import { Module } from '@nestjs/common';
import { MunicipalityService } from '../service/municipality.service';
import { MunicipalityController } from '../controllers/municipality.controller';

@Module({
  controllers: [MunicipalityController],
  providers: [MunicipalityService],
})
export class MunicipalityModule {}
