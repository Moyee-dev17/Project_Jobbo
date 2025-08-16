import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateMunicipalityDto } from './dto/create-municipality.dto';
import { UpdateMunicipalityDto } from './dto/update-municipality.dto';
import { PrismaService } from 'src/Prisma-config/prisma.service';

@Injectable()
export class municipalityService {
  constructor(private readonly db: PrismaService) {}

  async createMunnicipality(
    createMunicipalityDto: CreateMunicipalityDto,
    cityId: number,
  ) {
    try {
      const cityExist = await this.db.city.findUnique({
        where: { id: Number(cityId), isActive: true },
      });
      if (!cityExist) throw new NotFoundException('city not found');

      const municipalityExist = await this.db.municipality.findFirst({
        where: { name: createMunicipalityDto.name , isActive : true },
      });
      if (municipalityExist) throw new BadRequestException('municipality already exist');

      await this.db.municipality.create({
        data: {
          name: createMunicipalityDto.name,
          city: { connect: { id: cityExist.id } },
        }
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

  async findAll(page: number , limit: number) {
    try {
      const pageNumber= Number(page)||1
      const limitNumber=Number(limit)||10
      const skip = (pageNumber - 1) * limit;
      const nombreMunicipality = await this.db.city.count();
      const nombrePage = nombreMunicipality / limit;

      const allMuninicipality = await this.db.municipality.findMany({
        where: { isActive: true },
        orderBy: { createdAt: 'desc' },
        take: limitNumber,
        skip,
        include: { suburbs: true },
      });
    
      return {
        message: 'liste des municipalités',
        data: allMuninicipality,
        currentPage: page,
        TotalPage: nombrePage,
        TotalPost: nombreMunicipality,
      };
    } catch (error: any) {
      console.log(error);
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException(
        'internal serveur error exception',
      );
    }
  }

  async findOne(municipalityId: number) {
    try {
      const municipality = await this.db.municipality.findUnique({
        where: { id:municipalityId, isActive: true },
        include: { suburbs: true },
      });
      if (!municipality) throw new NotFoundException('municipality not found');
      return municipality;
    } catch (error: any) {
      console.log(error);
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException(
        'internal serveur error exception ',
      );
    }
  }

  async update(municipalityId: number, updateMunicipalityDto: UpdateMunicipalityDto) {
    try {
      const municipality = await this.db.municipality.findUnique({
        where: { id:municipalityId, isActive: true },
      });
      if (!municipality) throw new NotFoundException('municipality not found');
      const municipalityExist = await this.db.category.findFirst({
        where: { title: updateMunicipalityDto.name , isActive : true },
      });
      if (municipalityExist) throw new BadRequestException('municipality already exist');
      await this.db.municipality.update({
        where: { id : municipality.id},
        data: updateMunicipalityDto
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

  async remove(municipalityId: number) {
    try {
      const municipality = await this.db.municipality.findUnique({
        where: { id:municipalityId, isActive: true },
      });
      if (!municipality) throw new NotFoundException('municipality not found');
      await this.db.municipality.update({
        where: { id: municipality.id},
        data: { isActive: false }
      });
      return {
        message: 'deleted'
      };
    } catch (error: any) {
      console.log(error);
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException(
        'internal serveur error exception'
      );
    }
  }
}
