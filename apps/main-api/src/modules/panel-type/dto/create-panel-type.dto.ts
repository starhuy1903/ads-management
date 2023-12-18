import { IsNotEmpty, IsString } from 'class-validator';

export class CreatePanelTypeDto {
  @IsString()
  @IsNotEmpty()
  name: string;
}
