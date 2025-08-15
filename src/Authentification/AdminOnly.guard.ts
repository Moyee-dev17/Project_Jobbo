import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Role } from 'src/Seeder/seedRole';

//TODO : mettre dans un dossier authorization-manager
@Injectable()
export class AdminOnlyGuard implements CanActivate {
  
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req: any = context.switchToHttp().getRequest();

    const user: any = req.user;
    if (!user || (user.roleId !== Role.admin && user.roleId !== Role.root))
      throw new ForbiddenException('Action non autorisée');
    return true;
  }
}
