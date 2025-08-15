import { Module } from '@nestjs/common';
import { UsersService } from 'src/Users/userRegister/service/users.register.service';
import { UsersController } from 'src/Users/userRegister/controllers/users.controller';
import { PrismaModule } from 'src/Prisma-config/prisma.module';
import { JwtService } from '@nestjs/jwt';
import { OtpModule } from 'src/Authentification/otp.module';
@Module({
  imports: [PrismaModule, OtpModule],
  controllers: [UsersController],
  providers: [UsersService, JwtService],
})
export class UsersModule {}
