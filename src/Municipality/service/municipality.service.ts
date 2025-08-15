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
        where: { name: createMunicipalityDto.name , isActive : true },
      });
      if (MunExist) throw new BadRequestException('municipality already exist');

      await this.db.municipality.create({
        data: {
          name: createMunicipalityDto.name,
          city: { connect: { id: cityExist.id } },
        },
      });
      return {
      message : "Created"
      };
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
      const NombreMunicipality = await this.db.city.count();
      const NombrePage = NombreMunicipality / limit;

      const allMun = await this.db.municipality.findMany({
        where: { isActive: true },
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip,
        include: { suburbs: true },
      });
      if (!allMun) throw new NotFoundException('municipality not found');
      return {
        message: 'liste des municipalités',
        data: allMun,
        currentPage: Page,
        TotalPage: NombrePage,
        TotalPost: NombreMunicipality,
      };
    } catch (error: any) {
      console.log(error);
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException(
        'internal serveur error exception',
      );
    }
  }

  async findOne(id: number) {
    try {
      const Municipality = await this.db.municipality.findUnique({
        where: { id, isActive: true },
        include: { suburbs: true },
      });
      if (!Municipality) throw new NotFoundException('municipality not found');
      return Municipality;
    } catch (error: any) {
      console.log(error);
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException(
        'internal serveur error exception ',
      );
    }
  }

  async update(id: number, updateMunicipalityDto: UpdateMunicipalityDto) {
    try {
      const Municipality = await this.db.municipality.findUnique({
        where: { id, isActive: true },
      });
      if (!Municipality) throw new NotFoundException('municipality not found');
      const MunExist = await this.db.category.findFirst({
        where: { title: updateMunicipalityDto.name , isActive : true },
      });
      if (MunExist) throw new BadRequestException('municipality already exist');
      await this.db.municipality.update({
        where: { id : Municipality.id},
        data: updateMunicipalityDto,
      });
      return {
        message: 'updated',
      };
    } catch (error: any) {
      console.log(error);
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      )
        throw error;
      throw new InternalServerErrorException(
        'internal serveur error exception ',
      );
    }
  }

  async remove(id: number) {
    try {
      const Municipality = await this.db.municipality.findUnique({
        where: { id, isActive: true },
      });
      if (!Municipality) throw new NotFoundException('municipality not found');
      await this.db.municipality.update({
        where: { id: Municipality.id},
        data: { isActive: false },
      });
      return {
        message: 'deleted',
      };
    } catch (error: any) {
      console.log(error);
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException(
        'internal serveur error exception ',
      );
    }
  }
}
