import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { LoginDto } from '../Dto/login.dto';
import { PrismaService } from 'src/Prisma-config/prisma.service';
import { AuthService } from 'src/Authentification/auth.service';
import { updatePwdDto } from '../Dto/updatePassword.dto';
import { otpService } from 'src/Authentification/otpAuth.service';
import { OtpVerifyService } from 'src/Authentification/otpVerify';
import { resetPwdDto } from '../Dto/resetPassword.dto';

@Injectable()
export class loginUser {
  constructor(
    private readonly authService: AuthService,
    private readonly db: PrismaService,
    private readonly otpverify: OtpVerifyService,
    private readonly otpservice: otpService,
  ) {}

  async login(login: LoginDto) {
    const user = await this.db.users.findFirst({
      where: { phone: login.phone },
    });
    if (!user) throw new BadRequestException('Utilisateur introuvable');

    const passwordValid = await bcrypt.compare(login.password, user.password);
    if (!passwordValid) throw new BadRequestException('Mot de passe incorrect');

    const payload = { id: user.id };
    const access_token = await this.authService.tokenGenerate(payload);
    const User = await this.db.users.findUnique({ where: { id: user.id } });

    return {
      message: 'Connexion réussie',
      access_token,
      User,
    };
  }

  async updatePwd(userId: number, body: updatePwdDto) {
    const user = await this.db.users.findFirst({ where: { id: userId } });
    if (!user) throw new NotFoundException('Utilisateur introuvable');

    const passwordMatch = await bcrypt.compare(body.oldPassword, user.password);
    if (!passwordMatch)
      throw new BadRequestException('Ancien mot de passe incorrect');

    if (body.Newpassword !== body.confirmPassword)
      throw new BadRequestException('Les mots de passe ne correspondent pas');

    const hashedPassword = await bcrypt.hash(body.Newpassword, 10);
    await this.db.users.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });
    return { message: 'Mot de passe modifié avec succès' };
  }

  async updateNewPwd(userId: number, phone: string, Newpassword: string) {
    const user = await this.db.users.findFirst({ where: { phone } });
    if (!user) throw new NotFoundException('Utilisateur introuvable');

    const hashedPassword = await bcrypt.hash(Newpassword, 5);
    const updatepwd = await this.db.users.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });
    return { mesaage: 'mot de passe modifié avec success' };
  }

  async requestPasswordReset(phone: string) {
    const user = await this.db.users.findFirst({ where: { phone } });
    if (!user) throw new NotFoundException('Utilisateur non trouvé');
    const code = await this.otpservice.generateOtp(phone);
    return {
      message: 'Code OTP envoyé pour réinitialisation du mot de passe',
    };
  }

  async resetPassword(body: resetPwdDto) {
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

    const updatePassword = await this.db.users.update({
      where: { phone: body.phone },
      data: { password: hashedPassword },
    });
    return { message: 'Mot de passe réinitialisé avec succès' };
  }
}
