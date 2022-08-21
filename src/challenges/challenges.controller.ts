import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ChallengesService } from './challenges.service';
import { UpdateChallengeDto, CreateChallengeDto } from './dtos';
import { SetChallengeByMatchDto } from './dtos/set-challenge-by-match.dto';
import { Challenge } from './interfaces/challenge.interface';
import { ChallengeStatusValidation } from './validations/challenge-status-validation';

@Controller('api/v1/challenges')
export class ChallengesController {
  constructor(private readonly challengeService: ChallengesService) {}

  @Post()
  @UsePipes(ValidationPipe)
  async createChallengeHandle(
    @Body() createChallengeDto: CreateChallengeDto,
  ): Promise<Challenge> {
    return await this.challengeService.createChallenge(createChallengeDto);
  }

  @Get()
  async findAllChallengesHandle(
    @Query('playerId') _id: string,
  ): Promise<Challenge[]> {
    return _id
      ? await this.challengeService.findChallengeByPlayer(_id)
      : this.challengeService.findAllChallenges();
  }

  @Put('/:challengeId')
  async updateChallenge(
    @Body(ChallengeStatusValidation) updateChallengeDto: UpdateChallengeDto,
    @Param('challengeId') challengeId: string,
  ): Promise<void> {
    await this.challengeService.updateChallenge(
      challengeId,
      updateChallengeDto,
    );
  }

  @Post('/:challengeId/match')
  async setChallengeByMatchHandle(
    @Body(ValidationPipe) setChallengeByMatchDto: SetChallengeByMatchDto,
    @Param('challengeId') challengeId: string,
  ): Promise<void> {
    return await this.challengeService.setChallengeByMatch(
      challengeId,
      setChallengeByMatchDto,
    );
  }

  @Delete('/:challengeId')
  async deleteChallengeHandle(
    @Param('challengeId') challengeId: string,
  ): Promise<void> {
    await this.challengeService.deleteChallenge(challengeId);
  }
}
