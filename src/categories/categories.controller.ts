import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDTO } from './dtos/create-category.dto';
import { UpdateCategoryDto } from './dtos/update-category.dto';
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

  @Put('/:category')
  @UsePipes(ValidationPipe)
  async updateHandle(
    @Body() updateCategory: UpdateCategoryDto,
    @Param('category') category: string,
  ): Promise<void> {
    await this.categoriesService.updateCategory(category, updateCategory);
  }

  @Post('/:category/player/:playerId')
  async assignPlayerCategoryHandle(@Param() params: string[]): Promise<void> {
    return await this.categoriesService.assignPlayerCategory(params);
  }
}
