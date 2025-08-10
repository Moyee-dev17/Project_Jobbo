import { IsString, IsNotEmpty } from 'class-validator';

export class updatePwdDto {
  @IsString()
  @IsNotEmpty()
  oldPassword: string;

  @IsString()
  @IsNotEmpty()
  Newpassword: string;

  @IsString()
  @IsNotEmpty()
  confirmPassword: string;
}
