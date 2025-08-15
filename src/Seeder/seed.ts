import { seedRole } from './seedRole';
import { seeRoot } from './seedRoot';
import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaService } from 'src/Prisma-config/prisma.service';

@Injectable()
export class SeederService implements OnModuleDestroy, OnModuleInit {
  constructor(private readonly db: PrismaService) {}

  async onModuleInit() {
    try {
      await new seedRole(this.db).SeedRole();
      await new seeRoot(this.db).seed();
    } catch (error: any) {
      return error;
    }
  }
  async onModuleDestroy() {}
}
