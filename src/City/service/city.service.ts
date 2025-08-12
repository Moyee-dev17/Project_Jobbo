import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateCityDto } from '../dto/create-city.dto';
import { UpdateCityDto } from '../dto/update-city.dto';
import { PrismaService } from 'src/Prisma-config/prisma.service';

@Injectable()
export class CityService {
  constructor(private readonly db: PrismaService) {}

  async createCity(createCityDto: CreateCityDto) {
    try {
      const cityExist = await this.db.city.findFirst({
        where: { name: createCityDto.name, isActive: true },
      });
      if (cityExist) throw new BadRequestException('city already exist');

      await this.db.city.create({
        data: {
          name: createCityDto.name,
        },
      });
      return { message: 'created' };
    } catch (error: any) {
      if (error instanceof BadRequestException) throw error;
      console.log(error);
      throw new InternalServerErrorException('internal server error', error);
    }
  }

  async findAll(Page: number = 1, limit: number) {
    try {
      const skip = (Page - 1) * limit;
      const NombrePost = await this.db.city.count();
      const NombrePage = NombrePost / limit;

      const AllCity = await this.db.city.findMany({
        where: { isActive: true },
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip,

        select: {
          id: true,
          name: true,
        },
      });
      return {
        message: 'liste des cities',
        data: AllCity,
        currentPage: Page,
        NombrePage,
        NombrePost,
      };
    } catch (error: any) {
      console.log(error);
      throw new InternalServerErrorException(
        'internal serveur error exception ',
        error,
      );
    }
  }

  async findOne(id: number) {
    try {
      const OneCity = await this.db.city.findFirst({
        where: { id, isActive: true },
        include: { municipalities: true },
      });
      return OneCity;
    } catch (error: any) {
      console.log(error);
      throw new InternalServerErrorException(
        'internal serveur error exception ',
        error,
      );
    }
  }

  async update(id: number, updateCityDto: UpdateCityDto) {
    try {
      await this.db.city.update({
        where: { id, isActive: true },
        data: updateCityDto,
      });
      return { message: 'updated' };
    } catch (error: any) {
      console.log(error);
      throw new InternalServerErrorException(
        'internal serveur error exception ',
        error,
      );
    }
  }

  async remove(id: number) {
    try {
      await this.db.city.update({
        where: { id, isActive: true },
        data: { isActive: false },
      });
      return { message: 'deleted' };
    } catch (error: any) {
      console.log(error);
      throw new InternalServerErrorException(
        'internal serveur error exception ',
        error,
      );
    }
  }
}
