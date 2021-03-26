import { weakMerge } from '@dirtleague/common';
import DefaultConfig from './default-config';
import { server, client } from './envvar-config';

const { keys } = Object;

const keyScraper = (prefix: string, obj: any) =>
  keys(obj)
    .filter(key => key.startsWith(prefix))
    .reduce((acc, key) => {
      (acc as any)[key] = obj[key];
      return acc;
    }, {});

class ConfigManager {
  props = DefaultConfig;

  get client() {
    return keyScraper('REACT_APP_', this.props);
  }

  get server() {
    return keyScraper('DIRT_API_', this.props);
  }

  constructor() {
    this.props = weakMerge(DefaultConfig, { ...server, ...client });
  }
}

export default ConfigManager;

let instance: ConfigManager = null;

/**
 * @returns {ConfigManager}
 */
export const getDefaultConfigManager = (): ConfigManager => {
  if (instance === null) {
    instance = new ConfigManager();
  }

  return instance;
};
