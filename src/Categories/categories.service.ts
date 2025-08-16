import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { PrismaService } from 'src/Prisma-config/prisma.service';

@Injectable()
export class categoriesService {
  constructor(private readonly db: PrismaService) {}

  async createCategory(createCategoryDto: CreateCategoryDto) {
    try {
      const categoryExist = await this.db.category.findFirst({
        where: { title: createCategoryDto.title, isActive: true },
      });

      if (categoryExist) throw new BadRequestException('category already exist');

      await this.db.category.create({
        data: {
          title: createCategoryDto.title,
          description: createCategoryDto.description
        },
      });
      return { message: 'created' };
    } catch (error: any) {
      if (error instanceof BadRequestException) return error;
      throw new InternalServerErrorException('interal serer error');
    }
  }

  
  async findAll(page: number, limit: number) {
    try {
      const pageNumber = Number(page) || 1
      const limitNumber = Number(limit) || 10
      const skip = (pageNumber - 1 ) * limit
      const nombreCategorie = await this.db.category.count({
        where: { isActive: true },
      });
      const nombrePage = nombreCategorie / limitNumber;
      const totalPages = Math.ceil(nombrePage)

      const categories = await this.db.category.findMany({
        where: { isActive: true },
        take: limitNumber,
        skip,
        orderBy: { createdAt: 'desc' },
        include: { post: true },
      });
      return {
        message: 'liste des categories',
        data: categories,
        curentPage: page,
        totalPages,
        totalCategorie: nombreCategorie,
      };
    } catch (error: any) {
      console.log(error);
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('interal serer error');
    }
  }

  async findOne(categorieId: number) {
    try {
      const categorie = await this.db.category.findUnique({
        where: { id:categorieId, isActive: true },
        include: { post: true },
      });
      if (!categorie) throw new NotFoundException('categorie not found');
      return categorie;
    } catch (error: any) {
      console.log(error);
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('interal serer error');
    }
  }

  async updateCategory(id: number, updateCategoryDto: UpdateCategoryDto) {
    try {
      const category = await this.db.category.findUnique({
        where: { id, isActive: true },
      });

      if (!category) throw new NotFoundException('categorie not found');

      const categorie = await this.db.category.findFirst({
        where: { title: updateCategoryDto.title, isActive: true },
      });
      if (categorie) throw new BadRequestException('categorie already ready');
      await this.db.category.update({
        where: { id : category.id},
        data: updateCategoryDto,
      });

      return { message: 'updated' };
    } catch (error: any) {
      console.log(error);
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      )
        throw error;
      throw new InternalServerErrorException('interal serer error');
    }
  }

  async remove(id: number) {
    try {
      const category = await this.db.category.findUnique({
        where: { id, isActive: true },
      });

      if (!category) throw new NotFoundException('categorie not found');
      await this.db.category.update({
        where: { id : category.id},
        data: { isActive: false },
      });
      return { message: 'deleted' };
    } catch (error: any) {
      console.log(error);
      throw new InternalServerErrorException('interal serer error');
    }
  }
}
