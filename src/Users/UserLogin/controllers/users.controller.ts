import {
  Controller,
  Post,
  Body,
  UseGuards,
  HttpCode,
  Patch,
  BadRequestException,
  Param,
  Req,
} from '@nestjs/common';
import { CreateUserDto } from 'src/Users/userRegister/dto/create-user.dto';
import { loginUser } from '../service/users.login.service';
import { JwtGuards } from 'src/Authentification/jwt.guard';
import { LoginDto } from '../Dto/login.dto';
import { updatePwdDto } from '../Dto/updatePassword.dto';
import { resetPwdDto } from '../Dto/resetPassword.dto';
@Controller('users')
export class UsersLoginController {
  constructor(private readonly usersLoginService: loginUser) {}

  @Post('signIn')
  @HttpCode(200)
  create(@Body() login: LoginDto) {
    return this.usersLoginService.login(login);
  }

  @UseGuards(JwtGuards)
  @Patch('updatePwd')
  updatePwd(@Body() body: updatePwdDto, @Req() req: any) {
    const userId = req.user.id;
    return this.usersLoginService.updatePwd(+userId, body);
  }

  @UseGuards(JwtGuards)
  @Patch('updateNewPwd')
  updateNewPwd(
    @Body() body: { phone: string; Newpassword: string },
    @Req() req: any,
  ) {
    const userId = req.user.id;
    return this.usersLoginService.updateNewPwd(
      +userId,
      body.phone,
      body.Newpassword,
    );
  }

  @UseGuards(JwtGuards)
  @Post('forgot-password')
  async requestPasswordReset(@Body('phone') phone: string) {
    return await this.usersLoginService.requestPasswordReset(phone);
  }

  @UseGuards(JwtGuards)
  @Patch('reset-password')
  async resetPasswordWithOtp(@Body() body: resetPwdDto, @Req() req: any) {
    return await this.usersLoginService.resetPassword(body);
  }
}
