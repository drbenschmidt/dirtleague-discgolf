/* eslint-disable class-methods-use-this */
import { ConnectionPool } from '@databases/mysql';
import { Repository } from '../repository';

export interface DbAlias {
  id?: number;
  playerId: number;
  value: string;
}

let mockDb: DbAlias[] = [];

class AliasesRepository implements Repository<DbAlias> {
  db: ConnectionPool;

  constructor(db: ConnectionPool) {
    this.db = db;
  }

  create(model: DbAlias): Promise<DbAlias> {
    mockDb.push(model);
    // eslint-disable-next-line no-param-reassign
    model.id = mockDb.length + 1;

    return Promise.resolve(model);
  }

  update(model: DbAlias): Promise<DbAlias> {
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

  get(id: number): Promise<DbAlias> {
    const db = mockDb.find(i => i.id === id);

    return Promise.resolve(db);
  }

  getAll(): Promise<DbAlias[]> {
    return Promise.resolve(mockDb);
  }

  getForUserId(id: number): Promise<DbAlias[]> {
    const db = mockDb.filter(i => i.playerId === id);

    return Promise.resolve(db);
  }
}

export default AliasesRepository;
