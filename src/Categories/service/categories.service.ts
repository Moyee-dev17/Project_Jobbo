import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateCategoryDto } from '../dto/create-category.dto';
import { UpdateCategoryDto } from '../dto/update-category.dto';
import { PrismaService } from 'src/Prisma-config/prisma.service';

@Injectable()
export class CategoriesService {
  constructor(private readonly db: PrismaService) {}

  async createCategory(createCategoryDto: CreateCategoryDto, userId: number) {
    try {
      const catExist = await this.db.category.findFirst({
        where: { title: createCategoryDto.title },
      });

      if (catExist) throw new BadRequestException('category already exist');

      await this.db.category.create({
        data: {
          title: createCategoryDto.title,
          description: createCategoryDto.description,
        },
      });
      return { message: 'created' };
    } catch (error) {
      if (error instanceof BadRequestException) return error;
      throw new InternalServerErrorException('interal serer error');
    }
  }

  async findAll() {
    const AllCat = this.db.category.findMany({
      where: { isActive: true },
      include: { post: true },
    });
    return AllCat;
  }

  async findOne(id: number) {
    const oneCat = await this.db.category.findUnique({
      where: { id, isActive: true },
      include: { post: true },
    });
    return oneCat;
  }

  async updateCategory(id: number, updateCategoryDto: UpdateCategoryDto) {
    await this.db.category.update({
      where: { id, isActive: true },
      data: updateCategoryDto,
    });
    return { message: 'updated' };
  }

  async remove(id: number) {
    await this.db.category.update({
      where: { id },
      data: { isActive: false },
    });
    return { message: 'deleted' };
  }
}
