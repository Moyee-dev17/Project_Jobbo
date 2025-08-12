import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateMunicipalityDto } from '../dto/create-municipality.dto';
import { UpdateMunicipalityDto } from '../dto/update-municipality.dto';
import { PrismaService } from 'src/Prisma-config/prisma.service';

@Injectable()
export class MunicipalityService {
  constructor(private readonly db: PrismaService) {}

  async createMun(
    createMunicipalityDto: CreateMunicipalityDto,
    cityId: number,
  ) {
    try {
      const cityExist = await this.db.city.findUnique({
        where: { id: Number(cityId), isActive: true },
      });
      if (!cityExist) throw new NotFoundException('city not found');

      const MunExist = await this.db.municipality.findFirst({
        where: { name: createMunicipalityDto.name },
      });
      if (MunExist) throw new BadRequestException('municipality already exist');

      const createMunicipality = await this.db.municipality.create({
        data: {
          name: createMunicipalityDto.name,
          city: { connect: { id: cityExist.id } },
        },
      });
      return createMunicipality;
    } catch (error: any) {
      console.log(error);
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      )
        throw error;

      throw new InternalServerErrorException('internal sever error', error);
    }
  }

  async findAll(Page: number = 1, limit: number = 10) {
    try {
      const skip = (Page - 1) * limit;
      const NombrePost = await this.db.city.count();
      const NombrePage = NombrePost / limit;

      const allMun = await this.db.municipality.findMany({
        where: { isActive: true },
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip,
        include: { suburbs: true },
      });
      return {
        message: 'liste des municipalités',
        data: allMun,
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
      const OneMun = await this.db.municipality.findUnique({
        where: { id, isActive: true },
        include: { suburbs: true },
      });
      return OneMun;
    } catch (error: any) {
      console.log(error);
      throw new InternalServerErrorException(
        'internal serveur error exception ',
        error,
      );
    }
  }

  async update(id: number, updateMunicipalityDto: UpdateMunicipalityDto) {
    try {
      await this.db.municipality.update({
        where: { id, isActive: true },
        data: updateMunicipalityDto,
      });
      return {
        message: 'updated',
      };
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
      await this.db.municipality.update({
        where: { id, isActive: true },
        data: { isActive: false },
      });
      return {
        message: 'deleted',
      };
    } catch (error: any) {
      console.log(error);
      throw new InternalServerErrorException(
        'internal serveur error exception ',
        error,
      );
    }
  }
}
