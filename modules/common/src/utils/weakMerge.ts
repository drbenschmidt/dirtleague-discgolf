import isNil from './isNil';

const weakMerge = <
  TLeft extends Record<string, unknown>,
  TRight extends Record<string, unknown>
>(
  left: TLeft,
  right: TRight
): TLeft & TRight => {
  return Object.keys(right).reduce((acc: any, keyName) => {
    if (!isNil(right[keyName])) {
      acc[keyName] = right[keyName];
    } else if (!isNil(left[keyName])) {
      acc[keyName] = left[keyName];
    }
    return acc;
  }, {});
};

export default weakMerge;
