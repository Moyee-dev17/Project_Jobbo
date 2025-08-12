import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateCategoryDto } from '../dto/create-category.dto';
import { UpdateCategoryDto } from '../dto/update-category.dto';
import { PrismaService } from 'src/Prisma-config/prisma.service';
import { log } from 'console';

@Injectable()
export class CategoriesService {
  constructor(private readonly db: PrismaService) {}

  async createCategory(createCategoryDto: CreateCategoryDto) {
    try {
      const catExist = await this.db.category.findFirst({
        where: { title: createCategoryDto.title , isActive:true},
      });

      if (catExist) throw new BadRequestException('category already exist');

      await this.db.category.create({
        data: {
          title: createCategoryDto.title,
          description: createCategoryDto.description,
        },
      });
      return { message: 'created' };
    } catch (error: any) {
      if (error instanceof BadRequestException) return error;
      throw new InternalServerErrorException('interal serer error');
    }
  }

  async findAll(Page: number = 1, limit: number = 10) {
    try {
      const skip = (Page - 1) * limit;
      const NombrePost = await this.db.category.count();
      const NombrePage = NombrePost / limit;

      const AllCat = this.db.category.findMany({
        where: { isActive: true },
        take: limit,
        skip,
        include: { post: true },
      });
      return {
        message: 'liste des categories',
        data: AllCat,
        curentPage: Page,
        NombrePage,
        NombrePost,
      };
    } catch (error: any) {
      console.log(error);
    }
  }

  async findOne(id: number) {
    try {
      const oneCat = await this.db.category.findUnique({
        where: { id, isActive: true },
        include: { post: true },
      });
      return oneCat;
    } catch (error: any) {
      console.log(error);
    }
  }

  async updateCategory(id: number, updateCategoryDto: UpdateCategoryDto) {
    try {
      await this.db.category.update({
        where: { id, isActive: true },
        data: updateCategoryDto,
      });
      return { message: 'updated' };
    } catch (error: any) {
      console.log(error);
    }
  }

  async remove(id: number) {
    try {
      await this.db.category.update({
        where: { id ,isActive:true},
        data: { isActive: false },
      });
      return { message: 'deleted' };
    } catch (error: any) {
      console.log(error);
    }
  }
}
