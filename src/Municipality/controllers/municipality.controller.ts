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
import { MunicipalityService } from '../service/municipality.service';
import { CreateMunicipalityDto } from '../dto/create-municipality.dto';
import { UpdateMunicipalityDto } from '../dto/update-municipality.dto';
import { JwtGuards } from 'src/Authentification/jwt.guard';
import { AdminOnlyGuard } from 'src/Authentification/AdminOnly.guard';

@Controller('municipality')
export class MunicipalityController {
  constructor(private readonly municipalityService: MunicipalityService) {}
  @UseGuards(JwtGuards, AdminOnlyGuard)
  @Post(':id')
  create(
    @Param('id') id: string,
    @Body() createMunicipalityDto: CreateMunicipalityDto,
  ) {
    return this.municipalityService.createMun(createMunicipalityDto, +id);
  }

  @Get()
  findAll(@Query('Page') Page: string, @Query('limit') limit: number) {
    return this.municipalityService.findAll(+Page, +limit);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.municipalityService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateMunicipalityDto: UpdateMunicipalityDto,
  ) {
    console.log(updateMunicipalityDto);
    return this.municipalityService.update(+id, updateMunicipalityDto);
  }
  @UseGuards(JwtGuards, AdminOnlyGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.municipalityService.remove(+id);
  }
}
