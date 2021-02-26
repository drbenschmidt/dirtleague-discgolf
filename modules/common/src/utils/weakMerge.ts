import isNil from './isNil';

const weakMerge = (left: any, right: any) => {
  return Object
    .keys(right)
    .reduce((acc: any, keyName) => {
      if (!isNil(right[keyName])) {
        acc[keyName] = right[keyName];
      } else if (!isNil(left[keyName])) {
        acc[keyName] = left[keyName];
      }
      return acc;
    }, {});
};

export default weakMerge;
