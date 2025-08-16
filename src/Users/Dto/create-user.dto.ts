import { IsNotEmpty, IsOptional, IsString } from '@nestjs/class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @IsString()
  @IsNotEmpty()
  phone: string;

  @IsString()
  @IsNotEmpty()
  email: string;

  @IsOptional()
  photo?: [];

  @IsString()
  @IsNotEmpty()
  password: string;
}
