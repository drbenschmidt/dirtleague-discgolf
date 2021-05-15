/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
const get = <TReturn>(obj: any, key: string): TReturn | undefined => {
  if (!obj) {
    return undefined;
  }

  return obj[key] as TReturn;
};

export default get;
