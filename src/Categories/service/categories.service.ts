import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateCategoryDto } from '../dto/create-category.dto';
import { UpdateCategoryDto } from '../dto/update-category.dto';
import { PrismaService } from 'src/Prisma-config/prisma.service';

@Injectable()
export class CategoriesService {
  constructor(private readonly db: PrismaService) {}

  async createCategory(createCategoryDto: CreateCategoryDto) {
    try {
      const catExist = await this.db.category.findFirst({
        where: { title: createCategoryDto.title, isActive: true },
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
      const NombreCategorie = await this.db.category.count({where:{isActive:true}});
      const NombrePage = NombreCategorie / limit;

      const Categories = this.db.category.findMany({
        where: { isActive: true },
        take: limit,
        skip,
        orderBy: {createdAt:'desc'},
        include: { post: true },
      });
      if(!Categories)throw new NotFoundException('categorie not found')
      return {
        message: 'liste des categories',
        data: Categories,
        curentPage: Page,
        totalPage:NombrePage,
        totalCategorie:NombreCategorie,
      };
    } catch (error: any) {
      console.log(error);
      if(error instanceof NotFoundException)throw error
      throw new InternalServerErrorException('interal serer error');

    }
  }

  async findOne(id: number) {
    try {
      const Categorie = await this.db.category.findUnique({
        where: { id, isActive: true },
        include: { post: true },
      });
      if(!Categorie)throw new NotFoundException('categorie not found')
      return Categorie;

    } catch (error: any) {
      console.log(error);
      if(error instanceof NotFoundException)throw error
      throw new InternalServerErrorException('interal serer error');

    }
  }

  async updateCategory(id: number, updateCategoryDto: UpdateCategoryDto) {
    try {
      const category=await this.db.category.findUnique({where:{id , isActive:true}})

      if(!category)throw new NotFoundException("categorie not found")

      const cat=await this.db.category.findFirst({where:{title:updateCategoryDto.title}})
      if(cat)throw new BadRequestException('categorie already ready')
      await this.db.category.update({
        where: { id, isActive: true },
        data: updateCategoryDto,
      });
    

      return { message: 'updated' };
    } catch (error: any) {
      console.log(error);
      if(error instanceof NotFoundException||
        error instanceof BadRequestException
      )throw error
      throw new InternalServerErrorException('interal serer error');
    }
  }

  async remove(id: number) {
    try {
      await this.db.category.update({
        where: { id, isActive: true },
        data: { isActive: false },
      });
      return { message: 'deleted' };
    } catch (error: any) {
      console.log(error);
      throw new InternalServerErrorException('interal serer error');
    }
  }
}
