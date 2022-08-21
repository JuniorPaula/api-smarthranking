import { Model } from 'mongoose';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PlayersService } from 'src/players/players.service';
import { CreateChallengeDto, UpdateChallengeDto } from './dtos';
import { Challenge, Match } from './interfaces/challenge.interface';
import { CategoriesService } from 'src/categories/categories.service';
import { ChallengeStatus } from './interfaces/challenge-status.enum';
import { SetChallengeByMatchDto } from './dtos/set-challenge-by-match.dto';

@Injectable()
export class ChallengesService {
  constructor(
    @InjectModel('Challenge') private readonly challengeModel: Model<Challenge>,
    @InjectModel('Match') private readonly matchModel: Model<Match>,
    private readonly playerService: PlayersService,
    private readonly categoryService: CategoriesService,
  ) {}

  async createChallenge(
    createChallengeDto: CreateChallengeDto,
  ): Promise<Challenge> {
    const players = await this.playerService.findAllPlayers();

    createChallengeDto.players.map((playerDto) => {
      const playerFiltered = players.filter((player) => {
        return player._id.toString() === playerDto._id;
      });

      if (!playerFiltered.length) {
        throw new BadRequestException('Jogador inválido.');
      }
    });

    const requesterPlayerOfMatch = createChallengeDto.players.filter(
      (player) => {
        return player._id === createChallengeDto.requester;
      },
    );

    if (!requesterPlayerOfMatch.length) {
      throw new BadRequestException(
        'O Solicitante deve ser um jogador da partida.',
      );
    }

    const playerCategory = await this.categoryService.findCategoryByPlayer(
      createChallengeDto.requester,
    );

    if (!playerCategory) {
      throw new BadRequestException(
        'O Solicitante deve está registrado em uma categoria',
      );
    }

    const newChallenge = new this.challengeModel(createChallengeDto);
    newChallenge.category = playerCategory.category;
    newChallenge.dateTimeOfChallenge = new Date();
    newChallenge.status = ChallengeStatus.PENDENTE;

    return newChallenge.save();
  }

  async findAllChallenges(): Promise<Challenge[]> {
    return await this.challengeModel
      .find()
      .populate('requester')
      .populate('players')
      .populate('match')
      .exec();
  }

  async findChallengeByPlayer(_id: any): Promise<Challenge[]> {
    const players = await this.playerService.findAllPlayers();

    const playerFiltered = players.filter((player) => {
      return player._id.toString() === _id;
    });

    if (!playerFiltered.length) {
      throw new BadRequestException('Jogador inválido.');
    }

    return await this.challengeModel
      .find()
      .where('players')
      .in(_id)
      .populate('requester')
      .populate('players')
      .populate('match')
      .exec();
  }

  async updateChallenge(
    id: string,
    updateChallengeDto: UpdateChallengeDto,
  ): Promise<void> {
    const challengeFinded = await this.isExistsChallenge(id);

    if (updateChallengeDto.status) {
      challengeFinded.dateTimeOfChallenge = new Date();
    }
    challengeFinded.status = updateChallengeDto.status;
    challengeFinded.dateTimeOfChallenge =
      updateChallengeDto.dateTimeOfChallenge;

    await this.challengeModel
      .findOneAndUpdate({ _id: id }, { $set: challengeFinded })
      .exec();
  }

  async setChallengeByMatch(
    id: string,
    setChallengeByMatchDto: SetChallengeByMatchDto,
  ): Promise<void> {
    const challengeFinded = await this.isExistsChallenge(id);

    const playerFiltered = challengeFinded.players.filter(
      (player) => player._id.toString() === setChallengeByMatchDto.def,
    );

    if (!playerFiltered.length) {
      throw new BadRequestException('O Jogador não faz parte do desafio!');
    }

    const result = await this.saveMatch(
      setChallengeByMatchDto,
      challengeFinded,
    );
    try {
      await this.challengeModel
        .findOneAndUpdate({ _id: id }, { $set: challengeFinded })
        .exec();
    } catch (error) {
      await this.matchModel.deleteOne({ _id: result._id }).exec();
      throw new InternalServerErrorException();
    }
  }

  async deleteChallenge(id: string): Promise<void> {
    const challengeFinded = await this.isExistsChallenge(id);

    challengeFinded.status = ChallengeStatus.CANCELADO;
    await this.challengeModel
      .findOneAndUpdate({ _id: id }, { $set: challengeFinded })
      .exec();
  }

  private async isExistsChallenge(id: string): Promise<Challenge> {
    const challengeFinded = await this.challengeModel
      .findOne({ _id: id })
      .exec();

    if (!challengeFinded) {
      throw new NotFoundException(`Desafio não encontrado!`);
    }
    return challengeFinded;
  }

  private async saveMatch(
    setChallengeByMatchDto: SetChallengeByMatchDto,
    challengeFinded: Challenge,
  ): Promise<Match> {
    const newMatch = new this.matchModel(setChallengeByMatchDto);
    newMatch.category = challengeFinded.category;
    newMatch.players = challengeFinded.players;

    const result = await newMatch.save();
    challengeFinded.status = ChallengeStatus.REALIZADO;
    challengeFinded.match = result._id;
    return result;
  }
}
