import { Injectable, UnauthorizedException } from '@nestjs/common';
import { totp } from 'otplib';
import { PrismaService } from 'src/Prisma-config/prisma.service';

@Injectable()
export class OtpVerifyService {
  constructor(private readonly db: PrismaService) {}

  async verifyOtp(phone: string, code: string) {
    try {
      const user = await this.db.users.findFirst({ where: { phone } });
      if (!user) throw new UnauthorizedException('Utilisateur introuvable');

      const secret: string = `${process.env.SECRET}-${phone}`;
      const isValid = totp.check(code, secret);

      if (!isValid) {
        throw new UnauthorizedException('Code OTP invalide');
      }

      const remaining = totp.timeRemaining();
      console.log(`il vous reste ${remaining}s avant l'expiration de l'OTP`);

      const updatedUser = await this.db.users.update({
        where: { phone: user.phone },
        data: { isActive: true },
      });

      return {
        message: 'OTP vérifié avec succès',
      };
    } catch (error: any) {
      if (error instanceof UnauthorizedException) throw error;
    }
  }
}
