import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PlayersService } from 'src/players/players.service';
import { CreateCategoryDTO } from './dtos/create-category.dto';
import { UpdateCategoryDto } from './dtos/update-category.dto';
import { Category } from './interfaces/category.interface';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel('Category') private readonly categoryModel: Model<Category>,
    private readonly playerService: PlayersService,
  ) {}

  async createCategory(
    createCategoryDto: CreateCategoryDTO,
  ): Promise<Category> {
    const { category } = createCategoryDto;
    const foundCategory = await this.findCategoryIfExists<Category>(category);
    if (foundCategory) {
      throw new BadRequestException('Categoria já cadastrada');
    }

    const newCategory = new this.categoryModel(createCategoryDto);
    return await newCategory.save();
  }

  async findAllCategories(): Promise<Category[]> {
    return this.categoryModel.find().populate('players').exec();
  }

  async loadByCategory(category: string): Promise<Category> {
    const foundCategory = await this.findCategoryIfExists<Category>(category);
    if (!foundCategory) {
      throw new NotFoundException(`Categoria ${category} não encontrada`);
    }
    return foundCategory;
  }

  async updateCategory(
    category: string,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<void> {
    const hasCategory = await this.findCategoryIfExists<Category>(category);
    if (!hasCategory) {
      throw new NotFoundException(`Categoria ${category} não encontrada`);
    }

    await this.categoryModel
      .findOneAndUpdate({ category }, { $set: updateCategoryDto })
      .exec();
  }

  async assignPlayerCategory(params: string[]): Promise<void> {
    const category = params['category'];
    const playerId = params['playerId'];

    const hasCategory = await this.findCategoryIfExists<Category>(category);
    const playerHasCategory = await this.categoryModel
      .find({ category })
      .where('players')

      .in(playerId)
      .exec();

    await this.playerService.findPlayerById(playerId);

    if (!hasCategory) {
      throw new NotFoundException(`Categoria ${category} não encontrada`);
    }

    if (playerHasCategory.length > 0) {
      throw new BadRequestException(
        `Jogador já cadastrado na categoria ${category}.`,
      );
    }

    hasCategory.players.push(playerId);
    await this.categoryModel.findOneAndUpdate(
      { category },
      { $set: hasCategory },
    );
  }

  private async findCategoryIfExists<T>(value: string): Promise<T> {
    return await this.categoryModel.findOne({ category: value });
  }
}
