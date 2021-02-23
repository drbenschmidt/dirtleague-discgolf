import createConnectionPool from '@databases/mysql';
import { getDefaultConfigManager } from '../config/manager.js';

const configManager = getDefaultConfigManager();
const connectionString = configManager.props.sqlConnectionString;

const db = createConnectionPool(connectionString);

// Make sure we clean up our mess when the process exists.
process.once('SIGTERM', () => {
  db.dispose().catch((ex) => {
    console.error(ex);
  });
});

export default db;
