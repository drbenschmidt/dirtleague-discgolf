const { max, min } = Math;

const clamper = (minimum: number, maximum: number) => (input: number): number =>
  max(minimum, min(input, maximum));

export default clamper;
