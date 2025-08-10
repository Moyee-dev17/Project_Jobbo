import { IsString, IsNotEmpty } from '@nestjs/class-validator';
export class CreateCategoryDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  description: string;
}
