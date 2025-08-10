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
import { OtpVerifyService } from 'src/Authentification/otpVerify';

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
      if (userExist && userExist.isActive == false) {
        const code = await this.otpservice.generateOtp(createUserDto.phone);
        return {
          message: "code d'activation envoyé",
        };
      }

      const passwordHHAsh = await bcrypt.hash(createUserDto.password, 10);
      const RegisterUser = await this.db.users.create({
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
      return RegisterUser;
    } catch (error) {
      console.log(error);
      if (error instanceof BadRequestException) throw error;
      throw new InternalServerErrorException('internal server error');
    }
  }

  async createAdmin(createAdmin: CreateUserDto) {
    try {
      const adminExist = await this.db.users.findUnique({
        where: { email: createAdmin.email },
      });

      if (adminExist) {
        throw new BadRequestException('admin already exist');
      }
      const passwordHHAsh = await bcrypt.hash(createAdmin.password, 10);

      const RegisterAdmin = await this.db.users.create({
        data: {
          fullName: createAdmin.fullName,
          phone: createAdmin.phone,
          email: createAdmin.email,
          roleId: Role.admin,
          password: passwordHHAsh,
        },
      });

      return RegisterAdmin;
    } catch (error) {
      if (error instanceof BadRequestException) throw error;
      throw new BadRequestException('internal server error', error);
    }
  }

  async findAll() {
    const GetListUser = await this.db.users.findMany({
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
    return GetListUser;
  }

  async findOne(id: number) {
    const getOneUser = await this.db.users.findUnique({
      where: { id, isActive: true },
      include: { post: true },
    });
    return getOneUser;
  }

  async update(id: number, updateUserDto: UpdateUserDto,userId:number) {
    const userexist = await this.db.users.findUnique({
      where: { id:userId, isActive: true },
    });
    if (!userexist) {
      console.log('user not found');
    }
    const UpdateUser = await this.db.users.update({
      where: { id:userId, isActive: true },
      data: updateUserDto,
    });
    return UpdateUser;
  }

  async certificateCompte(id: number) {
    const userExist = await this.db.users.findUnique({ where: { id } });
    if (!userExist) throw new NotFoundException('user not found');
    if (userExist.certificate == true)
      throw new BadRequestException('user already certificated');
    const certificateCmpt = await this.db.users.update({
      where: { id, isActive: true },
      data: { certificate: true },
    });
    return certificateCmpt;
  }

  async Uncertificate(id: number) {
    const userExist = await this.db.users.findUnique({ where: { id } });
    if (!userExist) throw new NotFoundException('user not found');
    if (userExist.certificate == false)
      throw new BadRequestException('this user is not certificate');
    const Uncertificate = await this.db.users.update({
      where: { id, isActive: true },
      data: { certificate: false },
    });
    return Uncertificate;
  }

  async remove(id: number, userId: number) {
    const userexist = await this.db.users.findUnique({ where: { id } });
    if (!userexist) throw new NotFoundException('user not found');
    const DeleteUser = await this.db.users.update({
      where: { id },
      data: { isActive: false },
    });
    return { message: 'compte supprimé avec succes' };
  }
}
