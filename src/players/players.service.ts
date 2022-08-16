import { Injectable, Logger } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { CreatePlayerDTO } from './dtos/create-player.dto';
import { Player } from './interfaces/player.interface';

@Injectable()
export class PlayersService {
  private readonly logger = new Logger(PlayersService.name);
  private players: Player[] = [];

  async createAndUpdatePlayer(createPlayerDto: CreatePlayerDTO): Promise<void> {
    const { email } = createPlayerDto;
    const player = this.players.find((player) => player.email === email);
    if (player) {
      this.update(player, createPlayerDto);
    } else {
      this.create(createPlayerDto);
    }
  }

  async findAllPlayers(): Promise<Player[]> {
    return this.players;
  }

  private create(createPlayerDto: CreatePlayerDTO): void {
    const { phoneNumber, email, name } = createPlayerDto;
    const player: Player = {
      _id: uuidv4(),
      phoneNumber,
      email,
      name,
      ranking: 'A',
      rankingPosition: 1,
      urlImagePlayer: 'https://image.com.br',
    };
    this.logger.log(`create player: ${JSON.stringify(player)}`);
    this.players.push(player);
  }

  private update(player: Player, createPlayerDto: CreatePlayerDTO): void {
    const { name } = createPlayerDto;
    player.name = name;
  }
}
