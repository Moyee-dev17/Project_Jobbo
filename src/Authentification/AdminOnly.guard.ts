import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Role } from 'src/Seeder/seedRole';

@Injectable()
export class AdminOnlyGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();

    const user = req.user;
    console.log(user);
    if (!user || (user.roleId !== Role.admin && user.roleId !== Role.root))
      throw new ForbiddenException('Action non autorisée');
    return true;
  }
}
