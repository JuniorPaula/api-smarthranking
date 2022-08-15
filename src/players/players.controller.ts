import { Body, Controller, Post } from '@nestjs/common';
import { CreatePlayerDTO } from './dtos/create-player.dto';

@Controller('api/v1/players')
export class PlayersController {
  @Post()
  async createAndUpdatedPlayers(@Body() createPlayerDto: CreatePlayerDTO) {
    const { phoneNumber, email, name } = createPlayerDto;
    return JSON.stringify({
      phoneNumber,
      email,
      name,
    });
  }
}
