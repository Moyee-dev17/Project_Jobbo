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
import { CategoriesService } from '../categories.service';
import { CreateCategoryDto } from '../dto/create-category.dto';
import { UpdateCategoryDto } from '../dto/update-category.dto';
import { JwtGuards } from 'src/authorization-manager/guards/jwt.guard';
import { AdminOnlyGuard } from 'src/authorization-manager/guards/AdminOnly.guard';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}
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
  findOne(@Param('categorieId') categorieId: number) {
    return this.categoriesService.findOne(+categorieId);
  }

  @UseGuards(JwtGuards, AdminOnlyGuard)
  @Patch(':id')
  update(
    @Param('categorieId') categorieId: number,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoriesService.updateCategory(+categorieId, updateCategoryDto);
  }

  @UseGuards(AdminOnlyGuard)
  @Delete(':id')
  remove(@Param('categorieId') categorieId: number) {
    return this.categoriesService.remove(+categorieId);
  }
}
