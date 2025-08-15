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
        where: { id: municipalityId, isActive: true },
      });
      if (!MunicExist) throw new NotFoundException('municipality not found');

      const suburbExist = await this.db.suburb.findFirst({
        where: { name: createSuburbDto.name, isActive: true },
      });
      if (suburbExist) throw new BadRequestException('suburb already exist');

      await this.db.suburb.create({
        data: {
          name: createSuburbDto.name,
          municipality: { connect: { id: MunicExist.id } },
        },
      });
      return { message: 'created' };
    } catch (error: any) {
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

  async findAll(Page: number = 1, limit: number = 10) {
    try {
      const skip = (Page - 1) * limit;
      const TotalSuburb = await this.db.post.count();
      const TotalPage = TotalSuburb / limit;
      const AllSuburb = await this.db.suburb.findMany({
        orderBy: { createdAt: 'asc' },
        take: limit,
        skip,
        select: {
          id: true,
          name: true,
        },
      });
      if (!AllSuburb) throw new NotFoundException('suburb not found');
      return {
        data: AllSuburb,
        currentPage: Page,
        TotalPost: TotalSuburb,
        TotalPage: TotalPage,
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
      const suburb = await this.db.suburb.findUnique({
        where: { id, isActive: true },
      });
      if (!suburb) throw new NotFoundException('suburb not found');
      return suburb;
    } catch (error: any) {
      console.log(error);
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException(
        'internal serveur error exception',
      );
    }
  }

  async update(id: number, updateSuburbDto: UpdateSuburbDto) {
    try {
      const suburbExist = await this.db.suburb.findUnique({
        where: { id, isActive: true },
      });
      if (!suburbExist) throw new NotFoundException('suburb not found');
      const suburb = await this.db.category.findFirst({
        where: { title: updateSuburbDto.name , isActive : true },
      });
      if (suburb) throw new BadRequestException('suburb already exist');
      await this.db.suburb.update({
        where: { id : suburbExist.id},
        data: updateSuburbDto,
      });
      return { message: 'updated' };
    } catch (error) {
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
      const suburbExist = await this.db.suburb.findFirst({
        where: { id, isActive: true },
      });
      if (!suburbExist) throw new NotFoundException('suburb not found');

      await this.db.suburb.update({
        where: { id : suburbExist.id},
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
