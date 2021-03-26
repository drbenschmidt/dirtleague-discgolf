import createConnectionPool from '@databases/mysql';
import { getDefaultConfigManager } from '../config/manager';

const config = getDefaultConfigManager();
const connectionString = config.props.DIRT_API_SQL_STRING;

const debugLoggers = {
  onQueryStart: (_query: any, { text, values }: any) => {
    console.log(
      `${new Date().toISOString()} START QUERY ${text} - ${JSON.stringify(
        values
      )}`
    );
  },
  onQueryResults: (_query: any, { text }: any, results: string | any[]) => {
    console.log(
      `${new Date().toISOString()} END QUERY   ${text} - ${
        results.length
      } results`
    );
  },
  onQueryError: (_query: any, { text }: any, err: { message: any; }) => {
    console.log(
      `${new Date().toISOString()} ERROR QUERY ${text} - ${err.message}`
    );
  },
};

const options = {
  connectionString,
};

const enableDebugLogging = false;

if (enableDebugLogging) {
  Object.assign(options, debugLoggers);
}

const db = createConnectionPool(options);

// Make sure we clean up our mess when the process exists.
process.once('SIGTERM', () => {
  db.dispose().catch(ex => {
    console.error(ex);
  });
});

export default db;
