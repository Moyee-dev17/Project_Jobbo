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
        where: { id: municipalityId ,isActive:true},
      });
      if (!MunicExist) throw new NotFoundException('municipality not found');

      const suburbExist = await this.db.suburb.findFirst({
        where: { name: createSuburbDto.name , isActive:true},
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
        error,
      );
    }
  }

  async findAll(Page: number = 1, limit: number = 10) {
    try {
      const skip = (Page - 1) * limit;
      const NbrTotalPost = await this.db.post.count();
      const NbrTotalPage = NbrTotalPost / limit;
      const AllSuburb = await this.db.suburb.findMany({
        orderBy: { createdAt: 'asc' },
        take: limit,
        skip,
        select: {
          id: true,
          name: true,
        },
      });
      return {
        data: AllSuburb,
        currentPage: Page,
        NbrTotalPost,
        NbrTotalPage,
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
      const OneSburb = await this.db.suburb.findUnique({ where: { id , isActive:true} });
      return OneSburb;
    } catch (error: any) {
      console.log(error);
      throw new InternalServerErrorException(
        'internal serveur error exception ',
        error,
      );
    }
  }

  async update(id: number, updateSuburbDto: UpdateSuburbDto) {
    try {
      await this.db.suburb.update({
        where: { id , isActive:true},
        data: updateSuburbDto,
      });
      return { message: 'updated' };
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(
        'internal serveur error exception ',
        error,
      );
    }
  }

  async remove(id: number) {
    try {
      await this.db.suburb.update({ where: { id ,isActive:true}, data: { isActive: false } });
      return { message: 'deleted' };
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(
        'internal serveur error exception ',
        error,
      );
    }
  }
}
