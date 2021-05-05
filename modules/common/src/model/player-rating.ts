// eslint-disable-next-line import/prefer-default-export
export enum RatingType {
  Event,
  League,
  Personal,
}

export interface PlayerRatingAttributes {
  id?: number;
  playerId: number;
  cardId: number;
  date: Date;
  rating: number;
  type: number;
}
