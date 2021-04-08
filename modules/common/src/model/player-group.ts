import {
  validate,
  IsInt,
  ValidationError,
  ValidateNested,
  Length,
  IsOptional,
} from 'class-validator';
import { LinkedList } from 'linked-list-typescript';
import { Memoize } from 'typescript-memoize';
import Cloneable from '../interfaces/cloneable';
import DirtLeagueModel from './dl-model';
import PlayerGroupPlayerModel, {
  PlayerGroupPlayerAttributes,
} from './player-group-player';
import PlayerGroupResultModel, {
  PlayerGroupResultAttributes,
} from './player-group-result';
import Validatable, { onlyClient } from '../interfaces/validatable';

export interface PlayerGroupAttributes {
  id?: number;
  cardId?: number;
  teamName?: string;
  players?: PlayerGroupPlayerAttributes[];
}

export default class PlayerGroupModel
  extends DirtLeagueModel<PlayerGroupAttributes>
  implements Cloneable<PlayerGroupModel>, Validatable {
  static defaults = {
    teamName: '',
    players: [] as PlayerGroupPlayerAttributes[],
  };

  constructor(obj: Record<string, any> = {}) {
    super({
      ...PlayerGroupModel.defaults,
      ...obj,
    });
  }

  get id(): number {
    return this.attributes.id;
  }

  set id(value: number) {
    this.setInt('id', value);
  }

  get cardId(): number {
    return this.attributes.cardId;
  }

  set cardId(value: number) {
    this.setInt('cardId', value);
  }

  @IsOptional(onlyClient)
  @Length(0, 128, onlyClient)
  get teamName(): string {
    return this.attributes.teamName;
  }

  set teamName(value: string) {
    this.set('teamName', value);
  }

  @Memoize()
  get results(): LinkedList<PlayerGroupResultModel> | undefined {
    const results = this.getAttribute<PlayerGroupResultAttributes[]>('results');

    if (results) {
      return new LinkedList<PlayerGroupResultModel>(
        ...results.map(
          (v: PlayerGroupResultAttributes) => new PlayerGroupResultModel(v)
        )
      );
    }

    return undefined;
  }

  @Memoize()
  get players(): LinkedList<PlayerGroupPlayerModel> {
    return new LinkedList<PlayerGroupPlayerModel>(
      ...this.attributes?.players?.map(
        (v: PlayerGroupPlayerAttributes) => new PlayerGroupPlayerModel(v)
      )
    );
  }

  @ValidateNested({ each: true, ...onlyClient })
  private get playersValidator(): PlayerGroupPlayerModel[] {
    return this.players.toArray();
  }

  clone(): PlayerGroupModel {
    const obj = this.toJson();

    return new PlayerGroupModel(obj);
  }

  async validate(): Promise<ValidationError[]> {
    const result = await validate(this, onlyClient);

    return result;
  }
}
