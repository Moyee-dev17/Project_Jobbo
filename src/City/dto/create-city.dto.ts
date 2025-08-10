import { IsString, IsNotEmpty } from '@nestjs/class-validator';
export class CreateCityDto {
  @IsString()
  @IsNotEmpty()
  name: string;
}
