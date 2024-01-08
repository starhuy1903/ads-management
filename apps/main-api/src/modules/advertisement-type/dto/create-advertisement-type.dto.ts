import { IsNotEmpty, IsString } from 'class-validator';

export class CreateAdvertisementTypeDto {
  @IsNotEmpty()
  @IsString()
  readonly name?: string;
}
