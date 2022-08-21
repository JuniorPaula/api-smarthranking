import { Model } from 'mongoose';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PlayersService } from 'src/players/players.service';
import { CreateChallengeDto, UpdateChallengeDto } from './dtos';
import { Challenge } from './interfaces/challenge.interface';
import { CategoriesService } from 'src/categories/categories.service';
import { ChallengeStatus } from './interfaces/challenge-status.enum';

@Injectable()
export class ChallengesService {
  constructor(
    @InjectModel('Challenge') private readonly challengeModel: Model<Challenge>,
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
    const challengeFinded = await this.challengeModel
      .findOne({ _id: id })
      .exec();

    if (!challengeFinded) {
      throw new NotFoundException(`Desafio ${challengeFinded} não encontrado!`);
    }

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
}
