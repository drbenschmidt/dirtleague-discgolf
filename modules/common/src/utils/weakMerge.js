import isNil from './isNil.js';

const weakMerge = (left, right) => {
  return Object
    .keys(right)
    .reduce((acc, keyName) => {
      if (!isNil(right[keyName])) {
        acc[keyName] = right[keyName];
      } else if (!isNil(left[keyName])) {
        acc[keyName] = left[keyName];
      }
      return acc;
    }, {});
};

export default weakMerge;
