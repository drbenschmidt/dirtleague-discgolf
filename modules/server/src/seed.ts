import { join } from 'path';
import fs from 'fs';
import { sql } from '@databases/mysql';
import database from './data-access/database';

const path = join(__dirname, 'data-access', 'schema', 'v1.sql');

if (!fs.existsSync(path)) {
  console.error(`Path not found: ${path}`);
  process.exit(1);
}

const query = sql.file(path);

const work = async () => {
  await database.query(query);
};

work()
  .then(() => process.exit(0))
  .catch(console.error);
