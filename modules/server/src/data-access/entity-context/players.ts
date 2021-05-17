import { sql } from '@databases/mysql';
import { keys } from 'ts-transformer-keys';
import { Table } from './entity-table';
import { DbCard } from './cards';
import { DbCourseLayout } from './course-layouts';
import { DbCourse } from './courses';
import { DbPlayerGroup } from './player-groups';
import { DbPlayerRating } from './player-ratings';
import { DbRound } from './rounds';
import { buildSelects, spliceObject } from '../query-builder/selecting';

export interface DbPlayer {
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

class PlayersTable extends Table<DbPlayer> {
  get columns(): Array<keyof DbPlayer> {
    return keys<DbPlayer>();
  }

  get tableName(): string {
    return 'players';
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
