const forEach = <TArray>(
  arr: Array<TArray>,
  callback: (arg: TArray) => Promise<void>
): Promise<void[]> => {
  return Promise.all(arr.map(callback));
};

export default forEach;
