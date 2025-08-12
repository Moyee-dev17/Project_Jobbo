import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from '../service/users.register.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { JwtGuards } from 'src/Authentification/jwt.guard';
import { AdminOnlyGuard } from 'src/Authentification/AdminOnly.guard';
import { RootOnlyGuard } from 'src/Authentification/RootOnly.guard';

@Controller('admin')
export class AdminController {
  constructor(private readonly usersService: UsersService) {}

  @Post('signup')
  createAdmin(@Body() createUserDto: CreateUserDto) {
    return this.usersService.createAdmin(createUserDto);
  }
  @UseGuards(JwtGuards, RootOnlyGuard)
  @Get()
  findAlladmin() {
    return this.usersService.findAlladmin();
  }

  @UseGuards(JwtGuards, RootOnlyGuard)
  @Patch('Activate/:id')
  @Patch()
  Activate(@Param('id') id: string) {
    return this.usersService.Active(+id);
  }

  @UseGuards(JwtGuards, RootOnlyGuard)
  @Patch('desctivate/:id')
  desActivate(@Param('id') id: string) {
    return this.usersService.Desactive(+id);
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
