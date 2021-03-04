const intersect = <T>(left: T[], right: T[]): T[] => {
  return left.filter(l => right.includes(l));
};

export default intersect;
