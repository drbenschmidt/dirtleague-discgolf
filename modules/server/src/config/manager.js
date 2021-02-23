import DefaultConfig from './default-config.js';
import EnvVarConfig from './envvar-config.js';
import { weakMerge } from '@dirtleague/common';

class ConfigManager {
  props = DefaultConfig;

  constructor() {
    this.props = weakMerge(DefaultConfig, EnvVarConfig);
  }
}

export default ConfigManager;

let instance = null;

/**
 * @returns {ConfigManager}
 */
export const getDefaultConfigManager = () => {
  if (instance === null) {
    instance = new ConfigManager();
  }

  return instance;
}