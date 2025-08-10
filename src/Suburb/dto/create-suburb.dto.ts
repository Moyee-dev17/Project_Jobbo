import { IsNotEmpty, IsString } from '@nestjs/class-validator';
export class CreateSuburbDto {
  @IsString()
  @IsNotEmpty()
  name: string;
}
