import { PrismaService } from 'src/Prisma-config/prisma.service';
import { Injectable } from '@nestjs/common';
export enum Role {
  user = 1,
  admin = 2,
  root = 3,
}
@Injectable()
export class seedRole {
  constructor(private readonly db: PrismaService) {}
  async SeedRole() {
    const tabRole = ['User', 'Admin', 'Root'];
    for (const i in tabRole) {
      const roleExist = await this.db.role.findFirst({
        where: { name: tabRole[i] },
      });
      if (roleExist) continue;
      const createRole = await this.db.role.createMany({
        data: { name: tabRole[i] },
      }); //TODO: eviter des variable qui ne sont pas utilisées
      console.log('seeder effectué');
      console.log(createRole);
    }
  }
}
