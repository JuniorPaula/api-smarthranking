import { Document } from 'mongoose';
import { Player } from 'src/players/interfaces/player.interface';

export type Events = {
  name: string;
  operation: string;
  value: number;
};

export class Category extends Document {
  readonly category: string;
  description: string;
  events: Array<Events>;
  players: Array<Player>;
}
