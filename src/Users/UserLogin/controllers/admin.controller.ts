import { Controller, Post, Body, UseGuards, HttpCode } from '@nestjs/common';
import { loginAdmin } from '../service/admin.login.service';
import { LoginDto } from '../Dto/login.dto';

@Controller('admin')
export class AdminLoginController {
  constructor(private readonly usersLoginService: loginAdmin) {}

  @Post('signIn')
  @HttpCode(200)
  create(@Body() login: LoginDto) {
    return this.usersLoginService.loginAdmin(login);
  }
}
