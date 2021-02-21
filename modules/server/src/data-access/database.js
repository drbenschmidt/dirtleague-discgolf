import createConnectionPool from '@databases/mysql';

// TODO: build out a function to search for envvars or default to a test string.
const connectionString = 'mysql://test-user:password@localhost:3306/test-db';

const db = createConnectionPool(connectionString);

process.once('SIGTERM', () => {
  db.dispose().catch((ex) => {
    console.error(ex);
  });
});

export default db;
