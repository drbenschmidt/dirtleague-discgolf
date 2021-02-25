const { parse, stringify } = JSON;

const deepClone = (obj) => parse(stringify(obj));

export default deepClone;
