import { Module } from '@nestjs/common';
import { cityService } from './city.service';
import { CityController } from './controllers/city.controller';

@Module({
  controllers: [CityController],
  providers: [cityService],
})
export class CityModule {}
