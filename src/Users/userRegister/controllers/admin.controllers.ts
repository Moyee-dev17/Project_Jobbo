import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  Query,
} from '@nestjs/common';
import { UsersService } from '../service/users.register.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { JwtGuards } from 'src/Authentification/jwt.guard';
import { AdminOnlyGuard } from 'src/Authentification/AdminOnly.guard';
import { RootOnlyGuard } from 'src/Authentification/RootOnly.guard';
import { Certificate } from 'crypto';

@Controller('admin')
export class AdminController {
  constructor(private readonly usersService: UsersService) {}

  @Post('signUp')
  createAdmin(@Body() createUserDto: CreateUserDto) {
    return this.usersService.createAdmin(createUserDto);
  }
  @UseGuards(JwtGuards, AdminOnlyGuard)
  @Patch('certificate/:id')
  CertificateCompte(@Param('id') Id: string) {
    return this.usersService.certificateCompte(+Id);
  }

  @UseGuards(JwtGuards, AdminOnlyGuard)
  @Patch('Uncertificate/:id')
  UnCertificateCompte(@Param('id') Id: string) {
    return this.usersService.Uncertificate(+Id);
  }
}
