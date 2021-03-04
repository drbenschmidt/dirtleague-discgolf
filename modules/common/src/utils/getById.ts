const getById = <T extends { id?: number }>(arr: T[], ids: number[]): T[] => {
  return arr.filter(i => i.id !== undefined && ids.includes(i.id));
};

export default getById;
