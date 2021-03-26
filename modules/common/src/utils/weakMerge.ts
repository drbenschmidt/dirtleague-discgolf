import isNil from './isNil';

const { keys } = Object;

const weakMerge = <
  TLeft extends Record<string, unknown>,
  TRight extends Record<string, unknown>
>(
  left: TLeft,
  right: TRight
): TLeft & TRight => {
  return Array.from(new Set([...keys(right), ...keys(left)])).reduce(
    (acc: any, keyName) => {
      if (!isNil(right[keyName])) {
        acc[keyName] = right[keyName];
      } else if (!isNil(left[keyName])) {
        acc[keyName] = left[keyName];
      }
      return acc;
    },
    {}
  );
};

export default weakMerge;
