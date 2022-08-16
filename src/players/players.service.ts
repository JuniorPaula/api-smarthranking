import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreatePlayerDTO } from './dtos/create-player.dto';
import { Player } from './interfaces/player.interface';

@Injectable()
export class PlayersService {
  constructor(
    @InjectModel('Player') private readonly playerModel: Model<Player>,
  ) {}

  async createAndUpdatePlayer(createPlayerDto: CreatePlayerDTO): Promise<void> {
    const { email } = createPlayerDto;
    const player = await this.playerModel.findOne({ email }).exec();
    if (player) {
      this.update(createPlayerDto);
    } else {
      this.create(createPlayerDto);
    }
  }

  async findAllPlayers(): Promise<Player[]> {
    return await this.playerModel.find().exec();
  }

  async findPlayerByEmail(email: string): Promise<Player> {
    const player = await this.playerModel.findOne({ email }).exec();
    if (!player) {
      throw new NotFoundException('Jogador não encontrado.');
    }
    return player;
  }

  async deletePlayer(email: string): Promise<void> {
    await this.playerModel.deleteOne({ email }).exec();
  }

  private async create(createPlayerDto: CreatePlayerDTO): Promise<Player> {
    const player = new this.playerModel(createPlayerDto);
    return await player.save();
  }

  private async update(createPlayerDto: CreatePlayerDTO): Promise<Player> {
    return await this.playerModel.findOneAndUpdate(
      { email: createPlayerDto.email },
      { $set: createPlayerDto },
    );
  }
}
