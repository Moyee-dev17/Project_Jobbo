import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
  Query,
  Delete,
} from '@nestjs/common';
import { municipalityService } from '../municipality.service';
import { CreateMunicipalityDto } from '../dto/create-municipality.dto';
import { UpdateMunicipalityDto } from '../dto/update-municipality.dto';
import { JwtGuards } from 'src/authorization-manager/guards/jwt.guard';
import { AdminOnlyGuard } from 'src/authorization-manager/guards/AdminOnly.guard';

@Controller('municipality')
export class MunicipalityController {
  constructor(private readonly municipalityService: municipalityService) {}
  @UseGuards(JwtGuards, AdminOnlyGuard)
  @Post(':id')
  create(
    @Param('id') id: number,
    @Body() createMunicipalityDto: CreateMunicipalityDto,
  ) {
    return this.municipalityService.createMunnicipality(createMunicipalityDto, +id);
  }

  @Get()
  findAll(@Query('page') page: number, @Query('limit') limit: number) {
    return this.municipalityService.findAll(+page, +limit);
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.municipalityService.findOne(+id);
  }
  @Patch(':id')
  update(
    @Param('id') id: number,
    @Body() updateMunicipalityDto: UpdateMunicipalityDto,
  ) {
    console.log(updateMunicipalityDto);
    return this.municipalityService.update(+id, updateMunicipalityDto);
  }
  @UseGuards(JwtGuards, AdminOnlyGuard)
  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.municipalityService.remove(+id);
  }
}
