import { AuthService } from './auth.service';
import { Controller, Post, Body } from '@nestjs/common';

@Controller('auth')
export class AuthController {
  constructor(private readonly authservice: AuthService) {}

  @Post('signIn')
  async loginUser(@Body() body: { id: number }) {
    const payload = { id: body.id };
    const token = await this.authservice.tokenGenerate(payload);
    return token;
  }
}
