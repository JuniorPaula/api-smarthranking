import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PlayersModule } from './players/players.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/api-ranking'),
    PlayersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
