import { Championship } from '@core/domain/entities/championship.entity';
import { PlayerRound } from '@core/domain/entities/player-round.entity';
import { Player } from '@core/domain/entities/player.entity';
import { Round } from '@core/domain/entities/round.entity';
import { Scoreboard } from '@core/domain/entities/scoreboard.entity';
import { IChampionshipsRepository } from '@core/domain/repositories/championships.repository';
import { ChampionshipsRepository } from '@core/infra/repositories/championships.repository';
import {
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

type IResponse = Championship['getData'] & {
  players: Player['getData'][];
  scoreboards: Scoreboard['getData'][];
  rounds: (Round['getData'] & {
    playersRounds: PlayerRound['getData'][];
  })[];
};

type IRequest = {
  id: string;
  playerId: string;
};

@Injectable()
export class FindChampionshipService {
  constructor(
    @Inject(ChampionshipsRepository)
    private readonly championshipsRepository: IChampionshipsRepository,
  ) {}

  async execute({ id, playerId }: IRequest): Promise<IResponse> {
    const championship = await this.championshipsRepository.findById(id);

    if (!championship) {
      throw new NotFoundException('This championship does not exists');
    }

    const playerIsParticipating = championship.getPlayers.find(
      player => player.getData.id === playerId,
    );

    if (!playerIsParticipating) {
      throw new ForbiddenException('You cannot access this championship');
    }

    championship.calculateRankings();

    return {
      ...championship.getData,
      rounds: championship.getRounds.map(round => ({
        ...round.getData,
        playersRounds: round.getPlayerRounds.map(
          playerRound => playerRound.getData,
        ),
      })),
      players: championship.getPlayers.map(player => player.getData),
      scoreboards: championship.getScoreboards.map(
        scoreboard => scoreboard.getData,
      ),
    };
  }
}
