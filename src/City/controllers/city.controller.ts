import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { CityService } from '../service/city.service';
import { CreateCityDto } from '../dto/create-city.dto';
import { UpdateCityDto } from '../dto/update-city.dto';
import { JwtGuards } from 'src/Authentification/jwt.guard';
import { AdminOnlyGuard } from 'src/Authentification/AdminOnly.guard';

@Controller('city')
export class CityController {
  constructor(private readonly cityService: CityService) {}

  @UseGuards(JwtGuards, AdminOnlyGuard)
  @Post()
  create(@Body() createCityDto: CreateCityDto) {
    return this.cityService.createCity(createCityDto);
  }

  @Get()
  findAll(@Query('Page') Page: string, @Query('limit') limit: string) {
    return this.cityService.findAll(+Page, +limit);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.cityService.findOne(+id);
  }

  @UseGuards(JwtGuards, AdminOnlyGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCityDto: UpdateCityDto) {
    return this.cityService.update(+id, updateCityDto);
  }

  @UseGuards(JwtGuards, AdminOnlyGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.cityService.remove(+id);
  }
}
