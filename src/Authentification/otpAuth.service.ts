import { totp } from 'otplib';
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/Prisma-config/prisma.service';

@Injectable()
export class otpService {
  constructor(private readonly db: PrismaService) {}
  async generateOtp(phone: string) {
    totp.options = {
      epoch: Date.now(),
      step: 300,
      digits: 4,
    };

    totp.timeUsed();
    totp.timeRemaining();

    const secret = `${process.env.SECRET}-${phone}`;
    const token = totp.generate(secret);
    console.log(token);
    return {
      message: 'Otp generé avec success',
    };
  }
}
