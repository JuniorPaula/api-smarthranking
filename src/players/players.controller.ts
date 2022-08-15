import { Body, Controller, Post } from '@nestjs/common';
import { CreatePlayerDTO } from './dtos/create-player.dto';
import { PlayersService } from './players.service';

@Controller('api/v1/players')
export class PlayersController {
  constructor(private readonly playerService: PlayersService) {}
  @Post()
  async createAndUpdatedPlayers(@Body() createPlayerDto: CreatePlayerDTO) {
    await this.playerService.createAndUpdatePlayer(createPlayerDto);
  }
}
