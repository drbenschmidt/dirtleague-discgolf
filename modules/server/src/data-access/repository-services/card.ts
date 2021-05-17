import { asyncForEach, CardModel, set } from '@dirtleague/common';
import toJson from '../../utils/toJson';
import { DbCard } from '../entity-context/cards';
import { Table } from '../entity-context/entity-table';
import Repository from './repository';
import { getIncludes } from './utils';

class CardRepository extends Repository<CardModel, DbCard> {
  get entityTable(): Table<DbCard> {
    return this.context.cards;
  }

  factory(row: DbCard): CardModel {
    return new CardModel(row);
  }

  async getForRound(id: number, includes?: string[]): Promise<CardModel[]> {
    const [myIncludes, nextIncludes] = getIncludes('card', includes);
    const rows = await this.context.cards.getForRound(id);
    const models = rows.map(card => new CardModel(card));

    if (myIncludes.includes('playerGroups')) {
      await asyncForEach(models, async model => {
        const playerGroups = await this.servicesInstance.playerGroups.getForCard(
          model.id,
          nextIncludes
        );

        set(model.attributes, 'playerGroups', playerGroups.map(toJson));
      });
    }

    return models;
  }
}

export default CardRepository;
