import { CardModel, set } from '@dirtleague/common';
import { DbCard } from '../entity-context/cards';
import { Table } from '../entity-context/entity-table';
import Repository from './repository';

class CardRepository extends Repository<CardModel, DbCard> {
  get entityTable(): Table<DbCard> {
    return this.context.cards;
  }

  factory(row: DbCard): CardModel {
    return new CardModel(row);
  }

  async getForRound(id: number): Promise<CardModel[]> {
    const rows = await this.context.cards.getForRound(id);

    return rows.map(card => new CardModel(card));
  }
}

export default CardRepository;
