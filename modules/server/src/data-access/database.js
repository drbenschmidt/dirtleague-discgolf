import createConnectionPool from '@databases/mysql';

const connectionString = 'mysql://test-user:password@localhost:3306/test-db';

const db = createConnectionPool(connectionString);

process.once('SIGTERM', () => {
  db.dispose().catch((ex) => {
    console.error(ex);
  });
});

export default db;
