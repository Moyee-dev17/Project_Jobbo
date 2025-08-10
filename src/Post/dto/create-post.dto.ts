import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  isNumber,
} from '@nestjs/class-validator';
import { isNotEmpty } from 'class-validator';
export class CreatePostDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsString()
  address: string;

  @IsNotEmpty()
  @IsString()
  addressTechnique: string;

  @IsNotEmpty()
  @IsString()
  contact: string;

  @IsOptional()
  photos?: [];

  @IsNumber()
  @IsNotEmpty()
  categorieId: number;
}
