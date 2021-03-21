/**
 * 
 * PlayerName,CourseName,LayoutName,Date,Total,+/-,Hole1,Hole2,Hole3,Hole4,Hole5,Hole6,Hole7,Hole8,Hole9,Hole10,Hole11,Hole12,Hole13,Hole14,Hole15,Hole16,Hole17,Hole18
Par,Capital Springs,Short Teepads to White Baskets,2020-08-13 11:39,63,,4,3,4,4,4,3,3,3,3,4,4,4,3,3,3,3,4,4
Actionjakson,Capital Springs,Short Teepads to White Baskets,2020-08-13 11:39,48,-15,3,2,3,3,2,3,3,2,2,3,3,4,2,3,2,3,3,2
 */

interface UDiscScore {
  number: number;
  score: number;
}

interface UDiscPlayer {
  name: string;
  scores: UDiscScore[];
}

const parsePlayer = (playerRaw: string) => {
  const playerSplit = playerRaw.split(',');
  const [name, course, layout, date, total, overUnder, ...holes] = playerSplit;
  const scores = holes.map((hole, index) => ({
    number: index + 1,
    score: parseInt(hole, 10),
  }));

  return {
    name,
    scores,
  } as UDiscPlayer;
};

const parseUDisc = (cardRaw: string): UDiscPlayer[] => {
  const cardLinesRaw = cardRaw.split('\n');
  const [header, par, ...playersRaw] = cardLinesRaw;

  return playersRaw.filter(line => line.length > 0).map(p => parsePlayer(p));
};

export default parseUDisc;
