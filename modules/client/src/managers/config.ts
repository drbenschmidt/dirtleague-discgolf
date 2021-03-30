let config: Record<string, any>;

// eslint-disable-next-line import/prefer-default-export
export const getConfig = (): Record<string, any> => {
  if (!config) {
    const dirtConfig = (window as any).dirtConfig || {};
    const env = process?.env || {};

    config = {
      ...dirtConfig,
      ...env,
    };
  }

  return config;
};
