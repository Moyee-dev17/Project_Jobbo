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
import { SuburbService } from '../service/suburb.service';
import { CreateSuburbDto } from '../dto/create-suburb.dto';
import { UpdateSuburbDto } from '../dto/update-suburb.dto';
import { JwtGuards } from 'src/Authentification/jwt.guard';
import { AdminOnlyGuard } from 'src/Authentification/AdminOnly.guard';

@Controller('suburb')
export class SuburbController {
  constructor(private readonly suburbService: SuburbService) {}

  @UseGuards(JwtGuards, AdminOnlyGuard)
  @Post(':id')
  create(@Param('id') id: string, @Body() createSuburbDto: CreateSuburbDto) {
    return this.suburbService.createSuburb(createSuburbDto, +id);
  }

  @Get()
  findAll(@Query('Page') Page: string, @Query('limit') limit: string) {
    return this.suburbService.findAll(+Page, +limit);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.suburbService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSuburbDto: UpdateSuburbDto) {
    return this.suburbService.update(+id, updateSuburbDto);
  }
  @UseGuards(JwtGuards, AdminOnlyGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.suburbService.remove(+id);
  }
}
