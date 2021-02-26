import DefaultConfig from './default-config';
import EnvVarConfig from './envvar-config';
import { weakMerge } from '@dirtleague/common';

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
export const getDefaultConfigManager = () => {
  if (instance === null) {
    instance = new ConfigManager();
  }

  return instance;
}