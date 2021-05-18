import {
  asyncForEach,
  CardModel,
  PlayerRatingModel,
  RatingType,
  RoundModel,
  set,
  sum,
} from '@dirtleague/common';
import calculateRating from '../../utils/calculateRating';
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

  async insert(model: CardModel): Promise<void> {
    const id = await this.entityTable.insert(model.toJson() as DbCard);

    set(model, 'id', id);

    if (model.playerGroups) {
      await this.syncCollection(
        model.playerGroups.toArray(),
        [],
        entity => set(entity, 'cardId', model.id),
        this.servicesInstance.playerGroups
      );
    }
  }

  async update(model: CardModel): Promise<void> {
    await this.entityTable.update(model.toJson() as DbCard);

    if (model.playerGroups) {
      const dbPlayerGroups = await this.context.playerGroups.getForCard(
        model.id
      );

      await this.syncCollection(
        model.playerGroups.toArray(),
        dbPlayerGroups,
        entity => set(entity, 'cardId', model.id),
        this.servicesInstance.playerGroups
      );
    }
  }

  async onRoundComplete(round: RoundModel): Promise<void> {
    // Go through each player card for this round
    const cards = await this.getForRound(round.id);

    const courseLayout = await this.servicesInstance.courseLayouts.get(
      round.courseLayoutId
    );

    this.servicesInstance.tx(async tx => {
      await asyncForEach(cards, async card => {
        // and get each player group on each card.
        const playerGroups = await tx.playerGroups.getForCard(card.id);
        // and then each player(s) for the groups.
        await asyncForEach(playerGroups, async playerGroup => {
          const results = await tx.playerGroupResults.getAllForGroup(
            playerGroup.id
          );

          const totalScore = sum(results.map(r => r.score));
          const { dgcrSse } = courseLayout;
          const rating = calculateRating(totalScore, dgcrSse);

          // Update the player group with the score and par of the card so we can
          // do other calculations in downstream flows.

          set(playerGroup, 'score', totalScore);
          set(playerGroup, 'par', courseLayout.par);

          await this.servicesInstance.playerGroups.update(playerGroup);

          const players = await this.servicesInstance.playerGroupPlayers.getForPlayerGroup(
            playerGroup.id,
            card.id
          );
          const playerIds = players.map(p => p.playerId);

          await asyncForEach(playerIds, async playerId => {
            await this.servicesInstance.playerRatings.insert(
              new PlayerRatingModel({
                playerId,
                cardId: card.id,
                date: new Date(), // TODO: Get from round?
                rating,
                type: RatingType.Event, // TODO: Allow client to specify type
              })
            );
          });
        });
      });
    });
  }
}

export default CardRepository;
