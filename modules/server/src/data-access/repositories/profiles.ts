/* eslint-disable class-methods-use-this */
import { ConnectionPool } from '@databases/mysql';

interface Repository<TModel> {
  create(model: TModel): Promise<TModel>;
  update(model: TModel): Promise<void>;
  delete(id: number): Promise<void>;
  get(id: number): Promise<TModel>;
  getAll(): Promise<TModel[]>;
}

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
    mockDb.push(model);
    // eslint-disable-next-line no-param-reassign
    model.id = mockDb.length + 1;

    return Promise.resolve(model);
  }

  update(model: DbProfile): Promise<void> {
    const db = mockDb.find(i => i.id === model.id);

    if (db) {
      Object.assign(db, model);
    }

    // eslint-disable-next-line no-useless-return
    return;
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
