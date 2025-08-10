import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateSuburbDto } from '../dto/create-suburb.dto';
import { UpdateSuburbDto } from '../dto/update-suburb.dto';
import { PrismaService } from 'src/Prisma-config/prisma.service';

@Injectable()
export class SuburbService {
  constructor(private readonly db: PrismaService) {}
  async createSuburb(createSuburbDto: CreateSuburbDto, municipalityId: number) {
    try {
      const MunicExist = await this.db.municipality.findUnique({
        where: { id: municipalityId },
      });
      if (!MunicExist) throw new NotFoundException('municipality not found'); 

      const suburbExist = await this.db.suburb.findFirst({
        where: { name: createSuburbDto.name },
      });
      if (suburbExist) throw new BadRequestException('suburb already exist');

      await this.db.suburb.create({
        data: {
          name: createSuburbDto.name,
          municipality: { connect: { id: MunicExist.id } },
        },
      });
      return {message:"created"}

    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      )
        throw error;
      throw new InternalServerErrorException(
        'internal serveur error exception ',
        error,
      );
    }
  }

  async findAll() {
    const AllSuburb = await this.db.suburb.findMany({
      orderBy: { createdAt: 'asc' },
      select: {
        id: true,
        name: true,
      },
    });
    return AllSuburb;
  }

  async findOne(id: number) {
    const OneSburb = await this.db.suburb.findUnique({ where: { id } });
    return OneSburb;
  }

  async update(id: number, updateSuburbDto: UpdateSuburbDto) {
     await this.db.suburb.update({
      where: { id },
      data: updateSuburbDto,
    });
    return {message:"updated"}
  }

  async remove(id: number) {
     await this.db.suburb.update({ where: { id } ,data:{isActive:false} });
    return {message:"deleted"}
  }
}
