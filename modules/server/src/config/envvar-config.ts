const { keys } = Object;

const keyScraper = (prefix: string) =>
  keys(process.env)
    .filter(key => key.startsWith(prefix))
    .reduce((acc, key) => {
      (acc as any)[key] = process.env[key];
      return acc;
    }, {});

export const client = keyScraper('REACT_APP_');
export const server = keyScraper('DIRT_API_');
