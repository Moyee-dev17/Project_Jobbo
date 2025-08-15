import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Role } from 'src/utils/enum';
@Injectable()
export class RootOnlyGuard implements CanActivate {
  constructor() {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req: any = context.switchToHttp().getRequest();
    const user = req.user;

    if (user.roleId !==Role.user && user.roleId !==Role.admin)
      throw new UnauthorizedException('Action non autorisée');
    return true;
  }
}
