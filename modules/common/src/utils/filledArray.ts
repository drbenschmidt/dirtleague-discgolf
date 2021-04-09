const filledArray = (start: number, size: number): number[] => {
  return new Array(size).fill(true).map((v, index) => start + index);
};

export default filledArray;
