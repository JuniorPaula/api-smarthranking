import * as mongoose from 'mongoose';

export const PlayerSchema = new mongoose.Schema(
  {
    email: { type: String, unique: true },
    phoneNumber: { type: String },
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
