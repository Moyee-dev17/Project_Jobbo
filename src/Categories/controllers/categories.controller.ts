import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
  Delete,
  Query,
} from '@nestjs/common';
import { categoriesService } from '../categories.service';
import { CreateCategoryDto } from '../dto/create-category.dto';
import { UpdateCategoryDto } from '../dto/update-category.dto';
import { JwtGuards } from 'src/authorization-manager/guards/jwt.guard';
import { AdminOnlyGuard } from 'src/authorization-manager/guards/AdminOnly.guard';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: categoriesService) {}
  @UseGuards(JwtGuards, AdminOnlyGuard)
  @Post()
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoriesService.createCategory(createCategoryDto);
  }

  @Get()
  findAll(@Query('page') page: number, @Query('limit') limit: number) {
    return this.categoriesService.findAll(+page, +limit);
  }
  
  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.categoriesService.findOne(+id);
  }

  @UseGuards(JwtGuards, AdminOnlyGuard)
  @Patch(':id')
  update(
    @Param('id') id: number,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoriesService.updateCategory(+id, updateCategoryDto);
  }

  @UseGuards(AdminOnlyGuard)
  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.categoriesService.remove(+id);
  }
}
