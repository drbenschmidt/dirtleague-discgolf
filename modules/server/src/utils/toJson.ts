const toJson = (obj: { toJson(): any }): any => {
  return obj.toJson();
};

export default toJson;
