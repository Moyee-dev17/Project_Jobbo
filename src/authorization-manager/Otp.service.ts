import { totp } from 'otplib';
import { Injectable, InternalServerErrorException } from '@nestjs/common';

@Injectable()
export class otpService {
  constructor() {}
  async generateOtp(phone: string) {
    try {
      totp.options = {
        epoch: Date.now(),
        step: 300,
        digits: 4,
      };

      totp.timeUsed();
      totp.timeRemaining();

      const secret: string = `${process.env.SECRET}-${phone}`;
      const token: string = totp.generate(secret);
      console.log(token);
      return {
        message: 'Otp generé avec success',
      };
    } catch (error: any) {
      console.log(error);
      throw new InternalServerErrorException('internal server error');
    }
  }
}
