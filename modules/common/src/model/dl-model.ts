const { keys } = Object;

// eslint-disable-next-line max-classes-per-file
function isIterable(obj: any) {
  // checks for null and undefined
  if (obj == null) {
    return false;
  }

  if (typeof obj === 'string') {
    return false;
  }

  return typeof obj[Symbol.iterator] === 'function';
}

class DirtLeagueModel<TAttributes> {
  attributes: TAttributes | Record<string, any> = {};

  defaults: TAttributes | Record<string, any> = {};

  constructor(obj: Record<string, any> = {}) {
    this.attributes = {
      ...this.defaults,
      ...obj,
    };
  }

  get<T>(key: string): T {
    const value = (this as any)[key] as T;
    const defaultValue = (this.defaults as any)[key] as T;

    if (value === undefined && defaultValue !== undefined) {
      return defaultValue;
    }

    return value;
  }

  toJson(): Record<string, any> {
    const result = {} as Record<string, any>;
    const totalKeys = new Set([
      ...keys(this.attributes),
      ...keys(this.defaults),
    ]);

    totalKeys.forEach(key => {
      const value = this.get(key);

      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      result[key] = getModelValue(value);
    });
    return result;
  }
}

export const getModelValue = (value: any): any => {
  if (value instanceof DirtLeagueModel) {
    return (value as DirtLeagueModel<unknown>).toJson();
  }

  if (isIterable(value)) {
    return Array.from(value, v => getModelValue(v));
  }

  return value;
};

export default DirtLeagueModel;
