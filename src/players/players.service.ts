import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UpdatePlayerDTO, CreatePlayerDTO } from './dtos';
import { Player } from './interfaces/player.interface';

@Injectable()
export class PlayersService {
  constructor(
    @InjectModel('Player') private readonly playerModel: Model<Player>,
  ) {}

  async createPlayer(createPlayerDto: CreatePlayerDTO): Promise<Player> {
    const { email } = createPlayerDto;
    const isExists = await this.playerModel.findOne({ email }).exec();
    if (isExists) {
      throw new BadRequestException('Email já cadastrado.');
    }
    const player = await this.create(createPlayerDto);
    return player;
  }

  async updatePlayer(
    id: string,
    updatePlayerDto: UpdatePlayerDTO,
  ): Promise<void> {
    const isExists = await this.playerModel.findOne({ _id: id }).exec();
    if (!isExists) {
      throw new NotFoundException('Jogador não encontrado');
    }
    await this.update(id, updatePlayerDto);
  }

  async findAllPlayers(): Promise<Player[]> {
    return await this.playerModel.find().exec();
  }

  async findPlayerById(id: string): Promise<Player> {
    const player = await this.playerModel.findOne({ _id: id }).exec();
    if (!player) {
      throw new NotFoundException('Jogador não encontrado.');
    }
    return player;
  }

  async deletePlayer(id: string): Promise<void> {
    const player = await this.playerModel.findOne({ _id: id }).exec();
    if (!player) {
      throw new NotFoundException('Jogador não encontrado.');
    }
    await this.playerModel.deleteOne({ _id: id }).exec();
  }

  private async create(createPlayerDto: CreatePlayerDTO): Promise<Player> {
    const player = new this.playerModel(createPlayerDto);
    return await player.save();
  }

  private async update(
    id: string,
    updatePlayerDto: UpdatePlayerDTO,
  ): Promise<Player> {
    return await this.playerModel.findOneAndUpdate(
      { _id: id },
      { $set: updatePlayerDto },
    );
  }
}
