import { CreateChampionshipRoundsService } from '@core/application/services/championships/create-championship-rounds.service';
import { CreateChampionshipService } from '@core/application/services/championships/create-championship.service';
import { FindChampionshipService } from '@core/application/services/championships/find-championship.service';
import { FindPlayerChampionshipsService } from '@core/application/services/championships/find-player-championships.service';
import { FinishChampionshipRoundService } from '@core/application/services/championships/finish-championship-round.service';
import { Module } from '@nestjs/common';

import { ChampionshipsController } from './championships.controller';

@Module({
  controllers: [ChampionshipsController],
  providers: [
    CreateChampionshipService,
    FindPlayerChampionshipsService,
    FindChampionshipService,
    CreateChampionshipRoundsService,
    FinishChampionshipRoundService,
  ],
})
export class ChampionshipsModule {}
