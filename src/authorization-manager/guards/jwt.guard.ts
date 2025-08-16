import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/Prisma-config/prisma.service';

@Injectable()
export class JwtGuards implements CanActivate {
  constructor(
    private readonly db: PrismaService,
    private readonly jwt: JwtService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req: any = context.switchToHttp().getRequest();

    const token = req.headers.authorization.split(' ')[1];
    console.log(token);
    if (!token) throw new ForbiddenException('Token is required');

    try {
      const decoded = this.jwt.verify(token, {
        secret: process.env.SECRET_KEY as string,
      });

      const user = await this.db.users.findUnique({
        where: { id: decoded.id },
      });

      if (!user) {
        throw new NotFoundException('Utilisateur non trouvé');
      }
      req.user = user;
      console.log(user);
      return true;
    } catch (error: any) {
      console.log(error);
      throw new ForbiddenException('Accès refusé : token invalide ou expiré');
    }
  }
}
