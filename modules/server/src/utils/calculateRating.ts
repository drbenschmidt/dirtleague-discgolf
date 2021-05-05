const calculateRating = (
  totalScore: number,
  dgcrSse: number,
  multiplier = 8
): number => {
  const diff = dgcrSse - totalScore;
  return Math.round(1000 + diff * multiplier);
};

export default calculateRating;
