import * as mongoose from 'mongoose';

export const PlayerSchema = new mongoose.Schema(
  {
    phoneNumber: { type: String, unique: true },
    email: { type: String, unique: true },
    name: String,
    ranking: String,
    rankingPosition: Number,
    urlImagePlayer: String,
  },
  {
    timestamps: true,
    collection: 'players',
  },
);
