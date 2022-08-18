import { IsNotEmpty } from 'class-validator';

export class UpdatePlayerDTO {
  @IsNotEmpty()
  readonly phoneNumber: string;

  @IsNotEmpty()
  name: string;
}
