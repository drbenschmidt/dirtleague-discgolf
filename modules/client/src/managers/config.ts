import { get } from '@dirtleague/common';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let config: Record<string, any>;

// eslint-disable-next-line import/prefer-default-export,@typescript-eslint/no-explicit-any
export const getConfig = (): Record<string, any> => {
  if (!config) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const dirtConfig = get<any>(window, 'dirtConfig') || {};
    const env = process?.env || {};

    config = {
      ...dirtConfig,
      ...env,
    };
  }

  return config;
};
