import { IsNotEmpty, IsString } from '@nestjs/class-validator';
export class CreateMunicipalityDto {
  @IsString()
  @IsNotEmpty()
  name: string;
}
