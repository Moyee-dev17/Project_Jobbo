import { Module } from '@nestjs/common';
import { categoriesService } from './categories.service';
import { CategoriesController } from './controllers/categories.controller';
import { PrismaService } from 'src/Prisma-config/prisma.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [CategoriesController],
  providers: [categoriesService, PrismaService, JwtService],
})
export class CategoriesModule {}