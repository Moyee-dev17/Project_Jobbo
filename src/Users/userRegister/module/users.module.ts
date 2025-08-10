import { Module } from '@nestjs/common';
import { UsersService } from '../service/users.register.service';
import { UsersController } from '../controllers/users.controller';
import { PrismaService } from 'src/Prisma-config/prisma.service';
import { PrismaModule } from 'src/Prisma-config/prisma.module';
import { JwtService } from '@nestjs/jwt';
import { OtpModule } from 'src/Authentification/otp.module';

@Module({
  imports: [PrismaModule, OtpModule],
  controllers: [UsersController],
  providers: [UsersService, PrismaService, JwtService],
})
export class UsersModule {}
