// ['rounds', 'round.cards', 'round.course', 'round.courseLayout', 'round.courseLayout.holes']
// getIncludes('event') => [['rounds'], ['round.cards', 'round.course', 'round.courseLayout', 'round.courseLayout.holes']]
// getIncludes('round') => [['cards', 'course', 'courseLayout'], ['courseLayout.holes']]]
// getIncludes('courseLayout') => [['holes'], []]

// eslint-disable-next-line import/prefer-default-export
export const getIncludes = (
  name: string,
  includes?: string[]
): [current: string[], next: string[]] => {
  const current: string[] = [];
  const next: string[] = [];

  if (!includes || includes.length === 0) {
    return [current, next];
  }

  const includesSplit = includes.map(include => include.split('.'));

  includesSplit.forEach(include => {
    if (include.length === 1) {
      current.push(include[0]);
    } else if (include[0] === name) {
      const [, currentPiece, ...rest] = include;

      if (rest.length === 0) {
        current.push(currentPiece);
      } else {
        next.push([currentPiece, ...rest].join('.'));
      }
    } else {
      next.push(include.join('.'));
    }
  });

  return [current, next];
};
