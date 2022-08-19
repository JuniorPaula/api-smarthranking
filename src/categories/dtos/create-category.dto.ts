import { ArrayMinSize, IsArray, IsNotEmpty, IsString } from 'class-validator';
import { Events } from '../interfaces/category.interface';

export class CreateCategoryDTO {
  @IsString()
  @IsNotEmpty()
  readonly category: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsArray()
  @ArrayMinSize(1)
  events: Array<Events>;
}
