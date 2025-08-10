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
        where: { name: createCityDto.name },
      });
      if (cityExist) throw new BadRequestException('city already exist');

      await this.db.city.create({
        data: {
          name: createCityDto.name,
        },
      });
      return { message: 'created' };
    } catch (error) {
      if (error instanceof BadRequestException) throw error;
      console.log(error);
      throw new InternalServerErrorException('internal server error', error);
    }
  }

  async findAll() {
    const AllCity = await this.db.city.findMany({
      select: {
        id: true,
        name: true,
      },
    });
    return AllCity;
  }

  async findOne(id: number) {
    const OneCity = await this.db.city.findFirst({
      where: { id, isActive: true },
      include: { municipalities: true },
    });
    return OneCity;
  }

  async update(id: number, updateCityDto: UpdateCityDto) {
    await this.db.city.update({
      where: { id },
      data: updateCityDto,
    });
    return { message: 'updated' };
  }

  async remove(id: number) {
    await this.db.city.update({
      where: { id },
      data: { isActive: false },
    });
    return { message: 'deleted' };
  }
}
