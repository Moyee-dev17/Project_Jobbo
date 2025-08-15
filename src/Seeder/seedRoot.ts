import { PrismaService } from 'src/Prisma-config/prisma.service';
import { BadRequestException, Injectable } from '@nestjs/common';
import { Role } from './seedRole';
import * as bcrypt from 'bcrypt';

@Injectable()
export class seeRoot {
  constructor(private readonly db: PrismaService) {}

  async seed() {
    const email = process.env.EMAIL;
    const password = process.env.PASSWORD;
    const fullName = process.env.FULLNAME;
    const phone = String(process.env.PHONE);

    if (!email || !password || !fullName || !phone) {
      throw new BadRequestException('Missing or invalid .env values');
    }

    const userExist = await this.db.users.findUnique({
      where: { email },
    });

    if (userExist) throw new BadRequestException('User already exists');

    const passwdHash: any = await bcrypt.hash(password, 10);

    await this.db.users.create({
      data: {
        email: email,
        fullName: fullName,
        phone: phone,
        password: passwdHash,
        isActive: true,
        roleId: Role.root,
      },
    });
  }
}
