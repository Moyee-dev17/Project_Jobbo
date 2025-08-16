import { Module } from '@nestjs/common';
import { UsersService } from 'src/Users/service/users.register.service';
import { UsersController } from '../controllers/users.controller';
import { PrismaModule } from 'src/Prisma-config/prisma.module';
import { JwtService } from '@nestjs/jwt';
import { OtpModule } from 'src/authorization-manager/Otp.module';
@Module({
  imports: [PrismaModule, OtpModule],
  controllers: [UsersController],
  providers: [UsersService, JwtService],
})
export class UsersModule {}
