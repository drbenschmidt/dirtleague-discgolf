import { weakMerge } from '@dirtleague/common';
import DefaultConfig from './default-config';
import EnvVarConfig from './envvar-config';

class ConfigManager {
  props = DefaultConfig;

  constructor() {
    this.props = weakMerge(DefaultConfig, EnvVarConfig);
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
