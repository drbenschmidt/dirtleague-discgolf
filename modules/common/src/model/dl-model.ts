import { Subject } from 'rxjs';

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

function isDate(obj: any): boolean {
  if (obj instanceof Date) {
    return true;
  }

  return false;
}

let cidCounter = 0;

interface OnChangeProps {
  key: string;
  value: any;
}

class DirtLeagueModel<TAttributes> {
  attributes: TAttributes | Record<string, any> = {};

  defaults: TAttributes | Record<string, any> = {};

  onChange = new Subject<OnChangeProps>();

  cid = 0;

  constructor(obj: Record<string, any> = {}) {
    this.attributes = {
      ...this.defaults,
      ...obj,
    };

    this.cid = ++cidCounter;
  }

  private getTotalKeys(): Set<string> {
    return new Set([...keys(this.attributes), ...keys(this.defaults)]);
  }

  getAttribute<T>(key: string): T {
    const value = (this.attributes as any)[key] as T;
    const defaultValue = (this.defaults as any)[key] as T;

    if (value === undefined && defaultValue !== undefined) {
      return defaultValue;
    }

    return value;
  }

  get<T>(key: string): T {
    const value = (this as any)[key] as T;
    const defaultValue = (this.defaults as any)[key] as T;

    if (value === undefined && defaultValue !== undefined) {
      return defaultValue;
    }

    return value;
  }

  set<T>(key: string, value: T): void {
    (this.attributes as any)[key] = value;
    this.onChange.next({ key, value });
  }

  setFloat(key: string, value: any): void {
    this.set(key, parseFloat(value));
  }

  setInt(key: string, value: any): void {
    this.set(key, parseInt(value, 10));
  }

  toJson(): Record<string, any> {
    const result = {} as Record<string, any>;

    this.getTotalKeys().forEach(key => {
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
