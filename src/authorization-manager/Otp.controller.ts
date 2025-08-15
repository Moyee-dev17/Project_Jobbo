import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { otpService } from './Otp.service';
import { OtpVerifyService } from './OtpVerify';


@Controller('otp')
export class OtpController {
  constructor(
    private readonly otpVerifyService: OtpVerifyService,
  ) {}

  @Post('verify')
  async verifyOtp(@Body() body: { phone: string; code: string }) {
    if (!body.phone || !body.code)
      throw new BadRequestException('Phone and code are required');
    return await this.otpVerifyService.verifyOtp(body.phone, body.code);
  }
}
