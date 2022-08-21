import { Document } from 'mongoose';
import { Player } from 'src/players/interfaces/player.interface';
import { ChallengeStatus } from './challenge-status.enum';

export interface Challenge extends Document {
  dateTimeOfChallenge: Date;
  status: ChallengeStatus;
  dateTimeOfChallengeRequest: Date;
  dateTimeOfChallengeResponse: Date;
  requester: Player;
  category: string;
  players: Player[];
  match: Match;
}

export interface Match extends Document {
  category: string;
  players: Player[];
  def: Player;
  result: Result[];
}

export type Result = {
  set: string;
};
