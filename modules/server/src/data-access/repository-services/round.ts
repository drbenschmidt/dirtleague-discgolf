import { asyncForEach, RoundModel, set } from '@dirtleague/common';
import { DbRound } from '../entity-context/rounds';
import { Table } from '../entity-context/entity-table';
import Repository from './repository';
import { getIncludes } from './utils';
import toJson from '../../utils/toJson';

class RoundRepository extends Repository<RoundModel, DbRound> {
  get entityTable(): Table<DbRound> {
    return this.context.rounds;
  }

  factory(row: DbRound): RoundModel {
    return new RoundModel(row);
  }

  async getAllForEvent(id: number, includes?: string[]): Promise<RoundModel[]> {
    const [myIncludes, nextIncludes] = getIncludes('round', includes);
    const rows = await this.context.rounds.getAllForEvent(id);
    const models = rows.map(round => new RoundModel(round));

    await asyncForEach(models, async model => {
      if (myIncludes.includes('course')) {
        const course = await this.servicesInstance.courses.get(
          model.courseId,
          nextIncludes
        );

        set(model.attributes, 'course', course.toJson());
      }

      if (myIncludes.includes('courseLayout')) {
        const course = await this.servicesInstance.courseLayouts.get(
          model.courseLayoutId,
          nextIncludes
        );

        set(model.attributes, 'courseLayout', course.toJson());
      }

      if (myIncludes.includes('cards')) {
        const cards = await this.servicesInstance.cards.getForRound(
          model.id,
          nextIncludes
        );

        set(model.attributes, 'cards', cards.map(toJson));
      }
    });

    return models;
  }

  async insert(model: RoundModel): Promise<void> {
    const id = await this.entityTable.insert(model.toJson() as DbRound);

    set(model, 'id', id);

    if (model.cards) {
      await this.servicesInstance.tx(async tx => {
        await asyncForEach(model.cards.toArray(), async card => {
          tx.cards.insert(card);
        });
      });
    }
  }
}

export default RoundRepository;
