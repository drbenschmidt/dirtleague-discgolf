import isNil from './isNil';

const { parse, stringify } = JSON;

const deepClone = <TObject>(obj: TObject): TObject | undefined => {
  if (isNil(obj)) {
    return undefined;
  }

  return parse(stringify(obj));
};

export default deepClone;
