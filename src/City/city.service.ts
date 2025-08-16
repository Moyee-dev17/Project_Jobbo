import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateCityDto } from './dto/create-city.dto';
import { UpdateCityDto } from './dto/update-city.dto';
import { PrismaService } from 'src/Prisma-config/prisma.service';

@Injectable()
export class cityService {
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

  async findAll(page: number, limit: number) {
    try {
      
      const pageNumber=Number(page)||1
      const limitNumber=Number(limit)||10
      const skip = (pageNumber - 1) * limit;
      const nombreCity = await this.db.city.count({where:{isActive:true}});
      const nombrePage = nombreCity / limit;
      const totalPage=Math.ceil(nombrePage)

      const allCity = await this.db.city.findMany({
        where: { isActive: true },
        orderBy: { createdAt: 'desc' },
        take: limitNumber,
        skip,
        select: {
          id: true,
          name: true,
        }
      });
      
      return {
        message: 'liste des cities',
        data: allCity,
        currentPage:nombrePage ,
        TotalPage: totalPage,
        TotalCity: nombreCity,
      };
    } catch (error: any) {
      console.log(error);
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException(
        'internal serveur error exception ',
      );
    }
  }

  async findOne(cityId: number) {
    try {
      const city = await this.db.city.findFirst({
        where: { id:cityId, isActive: true },
        include: { municipalities: {
          include:{suburbs:true}
        }},
      });
      if (!city) throw new NotFoundException('city not found');
      return city;
    } catch (error: any) {
      console.log(error);
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException(
        'internal serveur error exception',
      );
    }
  }

  async update(cityId: number, updateCityDto: UpdateCityDto) {
    try {
      const city = await this.db.city.findUnique({
        where: { id:cityId, isActive: true },
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

  async remove(cityId: number) {
    try {
      const city = await this.db.city.findUnique({
        where: { id:cityId, isActive: true }
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
