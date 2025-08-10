import { Module } from '@nestjs/common';
import { CategoriesService } from '../service/categories.service';
import { CategoriesController } from '../controllers/categories.controller';
import { PrismaService } from 'src/Prisma-config/prisma.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [CategoriesController],
  providers: [CategoriesService, PrismaService, JwtService],
})
export class CategoriesModule {}
