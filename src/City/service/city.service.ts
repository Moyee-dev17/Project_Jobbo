import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
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
        }
      });
      return { message: 'created' };
    } catch (error: any) {
      if (error instanceof BadRequestException) throw error;
      console.log(error);
      throw new InternalServerErrorException('internal server error');
    }
  }

  async findAll(Page: number, limit: number) {
    try {
      //TODO : refactoriser la pagination par defaut
      const skip = (Page - 1) * limit;
      const NombreCity = await this.db.city.count();
      const NombrePage = NombreCity / limit;

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
      if (!AllCity) throw new NotFoundException('city not found');
      return {
        message: 'liste des cities',
        data: AllCity,
        currentPage: Page,
        TotalPage: NombrePage,
        TotalCity: NombreCity,
      };
    } catch (error: any) {
      console.log(error);
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException(
        'internal serveur error exception ',
      );
    }
  }

  async findOne(id: number) {
    try {
      const City = await this.db.city.findFirst({
        where: { id, isActive: true },
        include: { municipalities: {
          include:{suburbs:true}
        }},
      });
      if (!City) throw new NotFoundException('city not found');
      return City;
    } catch (error: any) {
      console.log(error);
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException(
        'internal serveur error exception',
      );
    }
  }

  async update(id: number, updateCityDto: UpdateCityDto) {
    try {
      const city = await this.db.city.findUnique({
        where: { id, isActive: true },
      });
      if (!city) throw new NotFoundException('city not found');

      const cityExist = await this.db.category.findFirst({
        where: { title: updateCityDto.name , isActive : true},
      });
      if (cityExist) throw new BadRequestException('city already ready');
      await this.db.city.update({
        where: { id : city.id},
        data: updateCityDto,
      });
      return { message: 'updated' };
    } catch (error: any) {
      console.log(error);
      if (
        error instanceof BadRequestException ||
        error instanceof NotFoundException
      )
        throw new InternalServerErrorException(
          'internal serveur error exception ',
        );
    }
  }

  async remove(id: number) {
    try {
      const city = await this.db.city.findUnique({
        where: { id, isActive: true },
      });
      if (!city) throw new NotFoundException('city not found');
      await this.db.city.update({
        where: { id : city.id},
        data: { isActive: false },
      });
      return { message: 'deleted' };
    } catch (error: any) {
      console.log(error);
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException(
        'internal serveur error exception ',
      );
    }
  }
}
