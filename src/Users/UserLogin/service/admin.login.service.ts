import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
  InternalServerErrorException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { LoginDto } from '../Dto/login.dto';
import { PrismaService } from 'src/Prisma-config/prisma.service';
import { AuthService } from 'src/Authentification/auth.service';
import { Role } from 'src/Seeder/seedRole';
@Injectable()
export class loginAdmin {
  constructor(
    private readonly authService: AuthService,
    private readonly db: PrismaService,
  ) {}

  async loginAdmin(login: LoginDto) {
    try {
      const user = await this.db.users.findFirst({
        where: { phone: login.phone },
      });
      if (!user) {
        throw new BadRequestException('admin introuvable');
      }
      if (user.roleId != Role.admin && user.roleId != Role.root)
        throw new ForbiddenException('acces reservé aux admin');
      const passwordValid = await bcrypt.compare(login.password, user.password);

      if (!passwordValid) {
        throw new UnauthorizedException('Mot de passe incorrect');
      }

      const payload = { id: user.id };
      console.log(payload);
      const access_token = await this.authService.tokenGenerate(payload);
      console.log(access_token);
      const User = await this.db.users.findUnique({
        where: { id: payload.id },
      });

      return {
        message: 'Connexion réussie',
        access_token,
        User,
      };
    } catch (error) {
      if (
        error instanceof ForbiddenException ||
        error instanceof BadRequestException ||
        error instanceof UnauthorizedException
      )
        throw error;
      throw new InternalServerErrorException('internal server error');
    }
  }
}
