import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { PrismaService } from 'src/Prisma-config/prisma.service';
import * as bcrypt from 'bcrypt';
import { Role } from 'src/Seeder/seedRole';
import { otpService } from 'src/Authentification/otpAuth.service';

@Injectable()
export class UsersService {
  constructor(
    private readonly db: PrismaService,
    private readonly otpservice: otpService,
  ) {}
  async create(createUserDto: CreateUserDto) {
    try {
      const userExist = await this.db.users.findUnique({
        where: { email: createUserDto.email },
      });

      if (userExist && userExist.isActive == true)
        throw new BadRequestException('User already exist');

      if (userExist && userExist.isActive == false) {
        const code = await this.otpservice.generateOtp(createUserDto.phone);
        console.log(code);
        return {
          message: "code d'activation envoyé",
        };
      }

      const passwordHHAsh = await bcrypt.hash(createUserDto.password, 10);
      await this.db.users.create({
        data: {
          fullName: createUserDto.fullName,
          phone: createUserDto.phone,
          email: createUserDto.email,
          roleId: Role.user,
          password: passwordHHAsh,
          isActive: false,
        },
      });
      const otp = await this.otpservice.generateOtp(createUserDto.phone);
      console.log(otp);
      return {
        message: 'created',
      };
    } catch (error) {
      console.log(error);
      if (error instanceof BadRequestException) throw error;
      throw new InternalServerErrorException('internal server error');
    }
  }

  async createAdmin(createAdmin: CreateUserDto) {
    try {
      const adminExist = await this.db.users.findUnique({
        where: { email: createAdmin.email, isActive: true },
      });

      if (adminExist) {
        throw new BadRequestException('admin already exist');
      }
      const passwordHHAsh = await bcrypt.hash(createAdmin.password, 10);

      await this.db.users.create({
        data: {
          fullName: createAdmin.fullName,
          phone: createAdmin.phone,
          email: createAdmin.email,
          roleId: Role.admin,
          password: passwordHHAsh,
        },
      });

      return {
        message: 'created',
      };
    } catch (error: any) {
      if (error instanceof BadRequestException) throw error;
      throw new BadRequestException('internal server error', error);
    }
  }

  async findAll(Page: number = 1, limit: number = 10) {
    try {
      const skip = (Page - 1) * limit;
      const NbrTotalPost = await this.db.post.count();
      const NbrTotalPage = NbrTotalPost / limit;

      const users = await this.db.users.findMany({
        where: { isActive: true },
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip,

        select: {
          id: true,
          fullName: true,
          phone: true,
          email: true,
          roleId: true,
          password: true,
          certificate: true,
          isActive: true,
        },
      });
      return {
        data: users,
        currentPage: Page,
        totalPost :NbrTotalPost,
        totalPage :NbrTotalPage,
      };
    } catch (error: any) {
      throw new BadRequestException('internal server error', error);
    }
  }

  async findOne(id: number) {
    try {
      const user = await this.db.users.findUnique({
        where: { id, isActive: true },
        include: { post: true },
      });

      if(!user)throw new NotFoundException('user not found')
      return user;
    } catch (error: any) {
      console.log(error);
      throw new InternalServerErrorException('internal server error')
    }
  }

  async update(updateUserDto: UpdateUserDto, userId: number) {
    try {
      const userexist = await this.db.users.findUnique({
        where: { id: userId, isActive: true },
      });
      if (!userexist) throw new NotFoundException('user not found')
      const UpdateUser = await this.db.users.update({
        where: { id: userId, isActive: true },
        data: updateUserDto,
      });
      return UpdateUser;
    } catch (error: any) {
      console.log(error);
      if(error instanceof NotFoundException)throw error
      throw new InternalServerErrorException('internal server error')
      
    }
  }

  async certificateCompte(id: number) {
    try {
      const userExist = await this.db.users.findUnique({ where: { id , isActive:true} });
      if (!userExist) throw new NotFoundException('user not found');
      if (userExist.certificate == true)
        throw new BadRequestException('user already certificated');
       await this.db.users.update({
        where: { id, isActive: true },
        data: { certificate: true },
      });
      return { message: 'compte certifié avec succes' };
    } catch (error: any) {
      if (error instanceof NotFoundException||
          error instanceof BadRequestException
      ) throw error;
      console.log(error);
      throw new InternalServerErrorException('internal server error')
    }
  }

  async Uncertificate(id: number) {
    try {
      const userExist = await this.db.users.findUnique({ where: { id ,isActive:true } });
      if (!userExist) throw new NotFoundException('user not found');
      if (userExist.certificate == false)
        throw new BadRequestException('this user is not certificate');
    await this.db.users.update({
        where: { id, isActive: true },
        data: { certificate: false },
      });
      return {
        message: 'certification retirée',
      };
    } catch (error: any) {
      if (error instanceof NotFoundException||
          error instanceof BadRequestException
      ) throw error;
      throw new InternalServerErrorException('internal server error')
    }
  }

  async findAlladmin() {
    try {
      const admins = await this.db.users.findMany({
        where: { roleId: Role.admin, isActive: true },
      });
      return admins;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('internal server error')
    }
  }

  async Active(id: number) {
    try {
      const AdminExist = await this.db.users.findFirst({ where: { roleId:Role.admin ,id,isActive:true} });
      if (!AdminExist) throw new NotFoundException('admin not found');
      if (AdminExist && AdminExist.isActive == true)
        throw new BadRequestException('admin already activated');
      if (AdminExist && AdminExist.isActive == false) {
        await this.db.users.update({ where: { id }, data: { isActive: true } });
        return {
          message: 'admin activé avec succes',
        };
      }
    } catch (error: any) {
      if (error instanceof NotFoundException||
          error instanceof BadRequestException
      ) throw error;
      console.log(error);
      throw new InternalServerErrorException('internal server error')
    }
  }

  async Desactive(id: number) {
    try {
      const AdminExist = await this.db.users.findFirst({ where: { roleId:Role.admin , id,isActive:true} });
      if (!AdminExist) throw new NotFoundException('admin not found');
      if (AdminExist && AdminExist.isActive == false)
        throw new BadRequestException('admin already desactivated');
      if (AdminExist && AdminExist.isActive == true) {
        await this.db.users.update({
          where: { id },
          data: { isActive: false },
        });
        return {
          message: 'admin désactivé avec succes',
        };
      }
    } catch (error: any) {
      if (error instanceof NotFoundException||
          error instanceof BadRequestException
      ) throw error;
      console.log(error);
      throw new InternalServerErrorException('internal server error')
    }
  }

  async remove(id: number, userId: number) {
    try {
      const userexist = await this.db.users.findUnique({ where: { id:userId } });
      if (!userexist) throw new NotFoundException('user not found');
      await this.db.users.update({
        where: { id },
        data: { isActive: false },
      });
      return { message: 'compte supprimé avec succes' };
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      console.log(error);
      throw new InternalServerErrorException('internal server error')
    }
  }
}
