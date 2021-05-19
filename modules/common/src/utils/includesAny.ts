const { isArray } = Array;

const includesAny = <T>(arr: T[], values: T[]): boolean => {
  if (!isArray(arr)) {
    return false;
  }

  // eslint-disable-next-line no-restricted-syntax
  for (const value of values) {
    if (arr.includes(value)) {
      return true;
    }
  }

  return false;
};

export default includesAny;
