const { parse, stringify } = JSON;

const deepClone = (obj: any) => parse(stringify(obj));

export default deepClone;
