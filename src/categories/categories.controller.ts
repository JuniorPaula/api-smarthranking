import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDTO } from './dtos/create-category.dto';
import { Category } from './interfaces/category.interface';

@Controller('/api/v1/categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  @UsePipes(ValidationPipe)
  async createHanlde(
    @Body() createCategoryDto: CreateCategoryDTO,
  ): Promise<Category> {
    return await this.categoriesService.createCategory(createCategoryDto);
  }

  @Get()
  async findAllHanlde(): Promise<Category[]> {
    return await this.categoriesService.findAllCategories();
  }

  @Get('/:category')
  async loadByCategoryHandle(
    @Param('category') category: string,
  ): Promise<Category> {
    return await this.categoriesService.loadByCategory(category);
  }
}
