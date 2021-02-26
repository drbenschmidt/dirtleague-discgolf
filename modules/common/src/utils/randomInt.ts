const { floor, random } = Math;

const randomInt = (min = 0, max = 1): number =>
  floor(random() * (max - min + 1)) + min;

export default randomInt;
