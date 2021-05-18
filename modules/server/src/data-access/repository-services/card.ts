import {
  asyncForEach,
  CardModel,
  PlayerGroupResultModel,
  PlayerRatingModel,
  RatingType,
  RoundModel,
  set,
  sum,
} from '@dirtleague/common';
import { UDiscPlayer } from '../../utils/parseUdisc';
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

    await asyncForEach(cards, async card => {
      // and get each player group on each card.
      const playerGroups = await this.servicesInstance.playerGroups.getForCard(
        card.id
      );
      // and then each player(s) for the groups.
      await asyncForEach(playerGroups, async playerGroup => {
        const results = await this.servicesInstance.playerGroupResults.getAllForGroup(
          playerGroup.id
        );

        const totalScore = sum(results.map(r => r.score));
        const { dgcrSse } = courseLayout;
        const rating = calculateRating(totalScore, dgcrSse);

        // Update the player group with the score and par of the card so we can
        // do other calculations in downstream flows.
        await this.servicesInstance.playerGroups.patch(playerGroup.id, {
          score: totalScore,
          par: courseLayout.par,
        });

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
  }

  async applyScoreCard(id: number, scoreCard: UDiscPlayer[]): Promise<void> {
    const playerGroups = await this.servicesInstance.playerGroups.getForCard(
      id
    );
    const card = await this.get(id);
    const round = await this.servicesInstance.rounds.get(card.roundId);
    const holes = await this.servicesInstance.courseHoles.getAllForCourseLayout(
      round.courseLayoutId
    );

    const getHole = (n: number) => holes.find(h => h.number === n);

    // Look through each player group...
    await asyncForEach(playerGroups, async playerGroup => {
      const possibleNames = new Array<string>();

      // For possible names that could be on the uploaded card.
      if (playerGroup.teamName) {
        possibleNames.push(playerGroup.teamName.toLowerCase());
      }

      const dbPlayers = await this.servicesInstance.playerGroupPlayers.getForPlayerGroup(
        playerGroup.id,
        card.id
      );

      // Each player group has players, and those have aliases.
      await asyncForEach(dbPlayers, async dbPlayer => {
        const player = await this.servicesInstance.profiles.get(
          dbPlayer.playerId
        );

        // eslint-disable-next-line prettier/prettier
        possibleNames.push(
          `${player.firstName.toLowerCase()} ${player.lastName.toLowerCase()}`
        );

        const aliases = await this.servicesInstance.aliases.getForPlayerId(
          player.id
        );

        possibleNames.push(...aliases.map(a => a.value.toLowerCase()));
      });

      // And with that array, we can look through the scores to find a match.
      const match = scoreCard.find(f =>
        possibleNames.includes(f.name.toLowerCase())
      );

      if (match) {
        // Remove any results that we may already have, in the event someone fixes a card.
        await this.servicesInstance.playerGroupResults.deleteAllForGroup(
          playerGroup.id
        );

        // Loop through the uDisc scores and add them to the db!
        await asyncForEach(match.scores, async uDiscScore => {
          await this.servicesInstance.playerGroupResults.insert(
            new PlayerGroupResultModel({
              playerGroupId: playerGroup.id,
              courseHoleId: getHole(uDiscScore.number).id,
              score: uDiscScore.score,
            })
          );
        });
      }
    });

    // Update the card with the playerId of who just uploaded this card.
    await this.servicesInstance.cards.patch(card.id, {
      authorId: this.user.playerId,
    });
  }
}

export default CardRepository;
