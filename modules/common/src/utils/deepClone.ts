const { parse, stringify } = JSON;

const deepClone = <TObject>(obj: TObject): TObject => parse(stringify(obj));

export default deepClone;
