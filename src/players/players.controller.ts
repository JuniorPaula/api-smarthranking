import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CreatePlayerDTO } from './dtos/create-player.dto';
import { Player } from './interfaces/player.interface';
import { PlayerValidation } from './pipes/player-validation';
import { PlayersService } from './players.service';

@Controller('api/v1/players')
export class PlayersController {
  constructor(private readonly playerService: PlayersService) {}
  @Post()
  @UsePipes(ValidationPipe)
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
  async deletePlayer(
    @Query('email', PlayerValidation) email: string,
  ): Promise<void> {
    await this.playerService.deletePlayer(email);
  }
}
