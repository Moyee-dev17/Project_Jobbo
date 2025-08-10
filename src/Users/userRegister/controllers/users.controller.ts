import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Request,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from '../service/users.register.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { JwtGuards } from 'src/Authentification/jwt.guard';
import { AdminOnlyGuard } from 'src/Authentification/AdminOnly.guard';
import { otpService } from 'src/Authentification/otpAuth.service';
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly otpService: otpService,
  ) {}

  @Post('signUp')
  async create(@Body() createUserDto: CreateUserDto) {
    const token = await this.otpService.generateOtp(createUserDto.phone);
    const userCreate = await this.usersService.create(createUserDto);
    return {
      userCreate,
      token,
    };
  }

  @UseGuards(JwtGuards, AdminOnlyGuard)
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @UseGuards(JwtGuards)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

@UseGuards(JwtGuards)
  @Patch('update/:id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto,@Request() req:any) {
    const userId=req.user.id
    return this.usersService.update(+id, updateUserDto,userId);
  }
  @UseGuards(JwtGuards)
  @Patch('delete/:id')
  remove(@Param('id') id: string, @Request() req: any) {
    const userId = req.user.id;
    return this.usersService.remove(+id, userId);
  }
}
