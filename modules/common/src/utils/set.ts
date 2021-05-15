/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
const set = (obj: any, key: string, value: any): void => {
  // eslint-disable-next-line no-param-reassign
  obj[key] = value;
};

export default set;
