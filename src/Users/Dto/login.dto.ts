import { IsNotEmpty, IsString } from '@nestjs/class-validator';
export class LoginDto {
  @IsNotEmpty()
  @IsString()
  phone: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
