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
        where: { id: Number(cityId) },
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
    } catch (error) {
      console.log(error);
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      )
        throw error;

      throw new InternalServerErrorException('internal sever error', error);
    }
  }

  async findAll() {
    const allMun = await this.db.municipality.findMany({
      include: { suburbs: true },
    });
    return allMun;
  }

  async findOne(id: number) {
    const OneMun = await this.db.municipality.findUnique({
      where: { id, isActive: true },
      include: { suburbs: true },
    });
    return OneMun;
  }

  async update(id: number, updateMunicipalityDto: UpdateMunicipalityDto) {
    const UpdateMun = await this.db.municipality.update({
      where: { id, isActive: true },
      data: updateMunicipalityDto,
    });
    return UpdateMun;
  }

  async remove(id: number) {
    const removeMun = await this.db.municipality.update({
      where: { id },
      data: { isActive: false },
    });
    return removeMun;
  }
}
