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
import { cityService } from '../city.service';
import { CreateCityDto } from '../dto/create-city.dto';
import { UpdateCityDto } from '../dto/update-city.dto';
import { JwtGuards } from 'src/authorization-manager/guards/jwt.guard';
import { AdminOnlyGuard } from 'src/authorization-manager/guards/AdminOnly.guard';

@Controller('city')
export class CityController {
  constructor(private readonly cityService: cityService) {}

  @UseGuards(JwtGuards, AdminOnlyGuard)
  @Post()
  create(@Body() createCityDto: CreateCityDto) {
    return this.cityService.createCity(createCityDto);
  }

  @Get()
  findAll(@Query('page') page: number, @Query('limit') limit: number) {
    return this.cityService.findAll(+page, +limit);
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.cityService.findOne(+id);
  }

  @UseGuards(JwtGuards, AdminOnlyGuard)
  @Patch(':id')
  update(@Param('id') id: number, @Body() updateCityDto: UpdateCityDto) {
    return this.cityService.update(+id, updateCityDto);
  }

  @UseGuards(JwtGuards, AdminOnlyGuard)
  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.cityService.remove(+id);
  }
}
