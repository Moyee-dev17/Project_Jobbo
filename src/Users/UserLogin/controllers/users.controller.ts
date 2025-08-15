import {
  Controller,
  Post,
  Body,
  UseGuards,
  HttpCode,
  Patch,
  Req,
} from '@nestjs/common';
import { loginUser } from '../service/users.login.service';
import { JwtGuards } from 'src/Authentification/jwt.guard';
import { LoginDto } from '../Dto/login.dto';
import { updatePwdDto } from '../Dto/updatePassword.dto';
import { resetPwdDto } from '../Dto/resetPassword.dto';
import { loginAdmin } from '../service/admin.login.service';
@Controller('Auth')
export class UsersLoginController {
  constructor(
    private readonly usersLoginService: loginUser,
    private readonly AdminLogin: loginAdmin,
  ) {}

  @Post('signIn')
  @HttpCode(200)
  create(@Body() login: LoginDto) {
    return this.usersLoginService.login(login);
  }

  @Post('signin')
  @HttpCode(200)
  createAdmin(@Body() login: LoginDto) {
    return this.AdminLogin.loginAdmin(login);
  }

  @UseGuards(JwtGuards)
  @Patch('updatePwd')
  updatePwd(@Body() body: updatePwdDto, @Req() req: any) {
    const userId = req.user.id;
    return this.usersLoginService.updatePwd(+userId, body);
  }

  @UseGuards(JwtGuards)
  @Post('forgot-password')
  async requestPasswordReset(@Body('phone') phone: string) {
    return await this.usersLoginService.forgotPassword(phone);
  }

  @UseGuards(JwtGuards)
  @Patch('reset-password')
  async resetPasswordWithOtp(@Body() body: resetPwdDto) {
    return await this.usersLoginService.resetPassword(body);
  }
}
