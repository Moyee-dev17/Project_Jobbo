import { Module } from '@nestjs/common';
import { otpService } from './otpAuth.service';
import { OtpVerifyService } from './otpVerify';
import { OtpController } from './otpAuth.controller';
import { PrismaService } from 'src/Prisma-config/prisma.service';

//TODO : deplacer la ressource otp
@Module({
  controllers: [OtpController],
  providers: [otpService, OtpVerifyService, PrismaService],
  exports: [otpService, OtpVerifyService],
})
export class OtpModule {}
