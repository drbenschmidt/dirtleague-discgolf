/* eslint-disable class-methods-use-this */
import { Queryable, sql, SQLQuery } from '@databases/mysql';
import { keys } from 'ts-transformer-keys';
import { EntityTable } from './entity-table';
import { DbCard } from './cards';
import { DbCourseLayout } from './course-layouts';
import { DbCourse } from './courses';
import { DbPlayerGroup } from './player-groups';
import { DbPlayerRating } from './player-ratings';
import { DbRound } from './rounds';

const spliceObject = <TReturn>(obj: any, prefix: string): TReturn => {
  const newObj = Object.entries(obj)
    .filter(([key]) => key.startsWith(prefix))
    .reduce((acc, [key, value]) => {
      return {
        ...acc,
        [key.replace(`${prefix}_`, '')]: value,
      };
    }, {});

  return newObj as TReturn;
};

const buildSelect = (names: string[], prefix: string): SQLQuery => {
  const fields = names.map(key =>
    // eslint-disable-next-line no-underscore-dangle
    sql.__dangerous__rawValue(`${prefix}.${key} as "${prefix}_${key}"`)
  );

  return sql.join(fields, ', ');
};

const buildSelects = (kvps: [fields: string[], prefix: string][]): SQLQuery => {
  return sql.join(
    kvps.map(([fields, prefix]) => buildSelect(fields, prefix)),
    ', '
  );
};

interface DbPlayer {
  id?: number;
  firstName: string;
  lastName: string;
  bio: string;
  yearJoined: number;
  currentRating?: number;
}

interface FeedModel {
  rating: DbPlayerRating;
  card: DbCard;
  group: DbPlayerGroup;
  player: DbPlayer;
  course: DbCourse;
  round: DbRound;
  courseLayout: DbCourseLayout;
}

class PlayersTable implements EntityTable<DbPlayer> {
  db: Queryable;

  constructor(db: Queryable) {
    this.db = db;
  }

  async create(model: DbPlayer): Promise<number> {
    const [result] = await this.db.query(sql`
      INSERT INTO players (firstName, lastName, currentRating, bio, yearJoined)
      VALUES (${model.firstName}, ${model.lastName}, ${model.currentRating}, ${model.bio}, ${model.yearJoined});

      SELECT LAST_INSERT_ID();
    `);

    // eslint-disable-next-line no-param-reassign
    const id = result['LAST_INSERT_ID()'] as number;

    return id;
  }

  async update(model: DbPlayer): Promise<void> {
    await this.db.query(sql`
      UPDATE players
      SET
        firstName=${model.firstName},
        lastName=${model.lastName},
        currentRating=${model.currentRating},
        bio=${model.bio},
        yearJoined=${model.yearJoined}
      WHERE id=${model.id}
    `);
  }

  async delete(id: number): Promise<void> {
    await this.db.query(sql`
      DELETE FROM players
      WHERE id=${id}
    `);

    // TODO: Re-learn how to make foreign keys so I can make cascading deletes.
    await this.db.query(sql`
      DELETE FROM aliases
      WHERE playerId=${id}
    `);
  }

  async get(id: number): Promise<DbPlayer> {
    const [entity] = await this.db.query(sql`
      SELECT * FROM players
      WHERE id=${id}
    `);

    if (entity) {
      return entity;
    }

    return null;
  }

  async getAll(): Promise<DbPlayer[]> {
    const entities = await this.db.query(sql`
      SELECT * FROM players
    `);

    return entities;
  }

  async getFeed(id: number): Promise<FeedModel[]> {
    const selectClause = buildSelects([
      [keys<DbPlayerRating>(), 'pr'],
      [keys<DbCard>(), 'card'],
      [keys<DbPlayerGroup>(), 'pg'],
      [keys<DbPlayer>(), 'player'],
      [keys<DbRound>(), 'rnd'],
      [keys<DbCourse>(), 'course'],
      [keys<DbCourseLayout>(), 'cl'],
    ]);

    const query = sql`
      SELECT ${selectClause} FROM playerRatings as pr
      JOIN cards as card ON pr.cardId = card.id
      JOIN playerGroups as pg on pr.cardId = pg.cardId
      JOIN rounds as rnd ON card.roundId = rnd.id
      JOIN courses as course ON rnd.courseId = course.id
      JOIN courseLayouts as cl ON rnd.courseLayoutId = cl.id
      LEFT OUTER JOIN players as player on card.authorId = player.id
      WHERE playerId=${id}
      ORDER BY pr.id DESC
      LIMIT 10
    `;

    const resultsRaw = await this.db.query(query);

    const results = resultsRaw.map(row => {
      return {
        rating: spliceObject(row, 'pr'),
        card: spliceObject(row, 'card'),
        group: spliceObject(row, 'pg'),
        player: spliceObject(row, 'player'),
        round: spliceObject(row, 'rnd'),
        course: spliceObject(row, 'course'),
        courseLayout: spliceObject(row, 'cl'),
      };
    });

    return results.map(row => row as FeedModel);
  }
}

export default PlayersTable;
