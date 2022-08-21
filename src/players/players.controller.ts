import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CreatePlayerDTO, UpdatePlayerDTO } from './dtos';
import { Player } from './interfaces/player.interface';
import { ValidationParameters } from '../common/pipes/validation-parameters';
import { PlayersService } from './players.service';

@Controller('api/v1/players')
export class PlayersController {
  constructor(private readonly playerService: PlayersService) {}
  @Post()
  @UsePipes(ValidationPipe)
  async createPlayers(
    @Body() createPlayerDto: CreatePlayerDTO,
  ): Promise<Player> {
    return await this.playerService.createPlayer(createPlayerDto);
  }

  @Put('/:id')
  async updatePlayers(
    @Param('id', ValidationParameters) id: string,
    @Body() updatePlayerDto: UpdatePlayerDTO,
  ) {
    await this.playerService.updatePlayer(id, updatePlayerDto);
  }

  @Get()
  async findAllPlayers(): Promise<Player[]> {
    return this.playerService.findAllPlayers();
  }

  @Get('/:id')
  async findPlayerById(
    @Param('id', ValidationParameters) id: string,
  ): Promise<Player> {
    return this.playerService.findPlayerById(id);
  }

  @Delete('/:id')
  async deletePlayer(
    @Param('id', ValidationParameters) id: string,
  ): Promise<void> {
    await this.playerService.deletePlayer(id);
  }
}
