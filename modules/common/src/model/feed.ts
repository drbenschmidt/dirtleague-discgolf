import PlayerModel, { PlayerAttributes } from './player';
import CardModel, { CardAttributes } from './card';
import PlayerGroupModel, { PlayerGroupAttributes } from './player-group';
import { PlayerRatingAttributes } from './player-rating';
import CourseModel, { CourseAttributes } from './course';
import CourseLayoutModel, { CourseLayoutAttributes } from './course-layout';
import RoundModel, { RoundAttributes } from './round';

export interface FeedAttributes {
  rating: PlayerRatingAttributes;
  card: CardAttributes;
  group: PlayerGroupAttributes;
  player: PlayerAttributes;
  course: CourseAttributes;
  courseLayout: CourseLayoutAttributes;
  round: RoundAttributes;
}

export default class FeedModel {
  rating: PlayerRatingAttributes;

  card: CardModel;

  group: PlayerGroupModel;

  player: PlayerModel;

  course: CourseModel;

  courseLayout: CourseLayoutModel;

  round: RoundModel;

  constructor(props: FeedAttributes) {
    this.rating = props.rating;
    this.card = new CardModel(props.card);
    this.group = new PlayerGroupModel(props.group);
    this.player = new PlayerModel(props.player);
    this.course = new CourseModel(props.course);
    this.courseLayout = new CourseLayoutModel(props.courseLayout);
    this.round = new RoundModel(props.round);
  }
}
