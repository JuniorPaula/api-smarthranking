import { Body, Controller, Delete, Get, Post, Query } from '@nestjs/common';
import { CreatePlayerDTO } from './dtos/create-player.dto';
import { Player } from './interfaces/player.interface';
import { PlayersService } from './players.service';

@Controller('api/v1/players')
export class PlayersController {
  constructor(private readonly playerService: PlayersService) {}
  @Post()
  async createAndUpdatedPlayers(@Body() createPlayerDto: CreatePlayerDTO) {
    await this.playerService.createAndUpdatePlayer(createPlayerDto);
  }

  @Get()
  async findAllPlayers(
    @Query('email') email: string,
  ): Promise<Player[] | Player> {
    if (email) {
      return this.playerService.findPlayerByEmail(email);
    } else {
      return this.playerService.findAllPlayers();
    }
  }

  @Delete()
  async deletePlayer(@Query('email') email: string): Promise<void> {
    await this.playerService.deletePlayer(email);
  }
}
