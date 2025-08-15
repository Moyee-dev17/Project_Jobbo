import { Module } from '@nestjs/common';
import { otpService } from './Otp.service';
import { OtpVerifyService } from './OtpVerify';
import { OtpController } from './Otp.controller';
import { PrismaService } from 'src/Prisma-config/prisma.service';

//TODO : deplacer la ressource otp
@Module({
  controllers: [OtpController],
  providers: [otpService, OtpVerifyService, PrismaService],
  exports: [otpService, OtpVerifyService],
})
export class OtpModule {}
