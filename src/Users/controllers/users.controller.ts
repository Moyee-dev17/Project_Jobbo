import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Request,
  UseGuards,
  Query,
  Delete,
} from '@nestjs/common';
import { UsersService } from '../service/users.register.service';
import { CreateUserDto } from '../Dto/create-user.dto';
import { UpdateUserDto } from '../Dto/update-user.dto';
import { JwtGuards } from 'src/authorization-manager/guards/jwt.guard';
import { AdminOnlyGuard } from 'src/authorization-manager/guards/AdminOnly.guard';
import { otpService } from 'src/authorization-manager/Otp.service';
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly otpService: otpService,
  ) {}

  @Post('rsignup')
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
  findAll(@Query('Page') Page: string, @Query('limit') limit: string) {
    return this.usersService.findAll(+Page, +limit);
  }

  @UseGuards(JwtGuards)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @UseGuards(JwtGuards)
  @Patch(':id')
  update(@Body() updateUserDto: UpdateUserDto, @Request() req: any) {
    const userId: string = req.user.id;
    return this.usersService.update(updateUserDto, +userId);
  }

  @UseGuards(JwtGuards)
  @Delete('delete')
  remove(@Request() req: any) {
    const userId: string = req.user.id;
    return this.usersService.remove(+userId);
  }
}
