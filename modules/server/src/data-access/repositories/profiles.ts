/* eslint-disable class-methods-use-this */
import { ConnectionPool } from '@databases/mysql';
import { Repository } from '../repository';

interface DbProfile {
  id?: number;
  firstName: string;
  lastName: string;
  currentRating: number;
}

let mockDb: DbProfile[] = [];

class UsersRepository implements Repository<DbProfile> {
  db: ConnectionPool;

  constructor(db: ConnectionPool) {
    this.db = db;
  }

  create(model: DbProfile): Promise<DbProfile> {
    // eslint-disable-next-line no-param-reassign
    model.id = mockDb.length + 1;

    // Do this because the model needs to convert itself to the db row.
    mockDb.push({
      firstName: model.firstName,
      lastName: model.lastName,
      id: model.id,
      currentRating: 0,
    });

    return Promise.resolve(model);
  }

  update(model: DbProfile): Promise<DbProfile> {
    const db = mockDb.find(i => i.id === model.id);

    if (db) {
      Object.assign(db, model);
    }

    return Promise.resolve(db);
  }

  delete(id: number): Promise<void> {
    const db = mockDb.find(i => i.id === id);

    if (db) {
      mockDb = mockDb.filter(i => i !== db);
    }

    // eslint-disable-next-line no-useless-return
    return;
  }

  get(id: number): Promise<DbProfile> {
    const db = mockDb.find(i => i.id === id);

    return Promise.resolve(db);
  }

  getAll(): Promise<DbProfile[]> {
    return Promise.resolve(mockDb);
  }
}

export default UsersRepository;
