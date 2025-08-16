import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { LoginDto } from '../Dto/login.dto';
import { PrismaService } from 'src/Prisma-config/prisma.service';
import { jwtService } from 'src/Authentification/JwtService';
import { updatePwdDto } from '../Dto/updatePassword.dto';
import { otpService } from 'src/authorization-manager/Otp.service';
import { OtpVerifyService } from 'src/authorization-manager/OtpVerify';
import { resetPwdDto } from '../Dto/resetPassword.dto';

@Injectable()
export class loginUser {
  constructor(
    private readonly authService: jwtService,
    private readonly db: PrismaService,
    private readonly otpverify: OtpVerifyService,
    private readonly otpservice: otpService,
  ) {}

  async login(login: LoginDto) {
    try {
      const user = await this.db.users.findFirst({
        where: { phone: login.phone, isActive: true },
      });
      if (!user) throw new BadRequestException('Utilisateur introuvable');

      const passwordValid = await bcrypt.compare(login.password, user.password);
      if (!passwordValid)
        throw new BadRequestException('Mot de passe incorrect');

      const payload = { id: user.id };
      const access_token = await this.authService.tokenGenerate(payload);
      const User = await this.db.users.findUnique({
        where: { id: user.id, isActive: true },
      });

      return {
        message: 'Connexion réussie',
        access_token,
        User,
      };
    } catch (error: any) {
      if (error instanceof BadRequestException) throw error;
      throw new InternalServerErrorException('internal server error');
    }
  }

  async updatePwd(userId: number, body: updatePwdDto) {
    try {
      const user = await this.db.users.findFirst({
        where: { id: userId, isActive: true },
      });
      if (!user) throw new NotFoundException('Utilisateur introuvable');

      const passwordMatch = await bcrypt.compare(
        body.oldPassword,
        user.password,
      );
      if (!passwordMatch) throw new BadRequestException('password not match');

      if (body.Newpassword !== body.confirmPassword)
        throw new BadRequestException('password not match');

      const hashedPassword = await bcrypt.hash(body.Newpassword, 10);
      await this.db.users.update({
        where: { id: userId },
        data: { password: hashedPassword },
      });
      return { message: 'Mot de passe modifié avec succès' };
    } catch (error: any) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('internal server error');
    }
  }

  async forgotPassword(phone: string) {
    try {
      const user = await this.db.users.findFirst({ where: { phone } });
      if (!user) throw new NotFoundException('Utilisateur non trouvé');
      const code = await this.otpservice.generateOtp(phone);
      return {
        message: 'Code OTP envoyé pour réinitialisation du mot de passe',
      };
    } catch (error: any) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('internal server error');
    }
  }

  async resetPassword(body: resetPwdDto) {
    try {
      const user = await this.db.users.findUnique({
        where: { phone: body.phone },
      });
      if (!user) throw new NotFoundException('Utilisateur introuvable');

      const isValidOtp = await this.otpverify.verifyOtp(body.phone, body.code);
      if (!isValidOtp)
        throw new BadRequestException('Code OTP invalide ou expiré');

      if (body.newPassword !== body.confirmPassword)
        throw new BadRequestException('Les mots de passe ne correspondent pas');

      const hashedPassword = await bcrypt.hash(body.newPassword, 10);

      await this.db.users.update({
        where: { phone: body.phone },
        data: { password: hashedPassword },
      });
      return { message: 'Mot de passe réinitialisé avec succès' };
    } catch (error: any) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      )
        throw error;
      throw new InternalServerErrorException('internal server error');
    }
  }
}
