import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateCategoryDTO } from './dtos/create-category.dto';
import { Category } from './interfaces/category.interface';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel('Category') private readonly categoryModel: Model<Category>,
  ) {}

  async createCategory(
    createCategoryDto: CreateCategoryDTO,
  ): Promise<Category> {
    const { category } = createCategoryDto;
    const hasCategory = await this.categoryModel.findOne({ category }).exec();
    if (hasCategory) {
      throw new BadRequestException('Categoria já cadastrada');
    }

    const newCategory = new this.categoryModel(createCategoryDto);
    return await newCategory.save();
  }

  async findAllCategories(): Promise<Category[]> {
    return this.categoryModel.find().exec();
  }
}
