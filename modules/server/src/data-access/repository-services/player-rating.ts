import { PlayerRatingModel } from '@dirtleague/common';
import { DbPlayerRating } from '../entity-context/player-ratings';
import { Table } from '../entity-context/entity-table';
import Repository from './repository';

class PlayerRatingRepository extends Repository<
  PlayerRatingModel,
  DbPlayerRating
> {
  get entityTable(): Table<DbPlayerRating> {
    return this.context.playerRatings;
  }

  factory(row: DbPlayerRating): PlayerRatingModel {
    return new PlayerRatingModel(row);
  }

  async getForPlayerCardId(
    playerId: number,
    cardId: number
  ): Promise<PlayerRatingModel> {
    const row = await this.context.playerRatings.getForPlayerCardId(
      playerId,
      cardId
    );

    return new PlayerRatingModel(row);
  }
}

export default PlayerRatingRepository;
