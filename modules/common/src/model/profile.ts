import { AliasModel } from './alias';

export interface ProfileModel {
  id: number;
  firstName: string;
  lastName: string;
  currentRating: number;
  aliases?: AliasModel[];
}
