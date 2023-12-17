import { IsNotEmpty, IsString } from 'class-validator';

export class CreateLocationTypeDto {
  @IsString()
  @IsNotEmpty()
  name: string;
}
