/* eslint-disable jsx-a11y/alt-text */
import { ReactElement, useEffect, useState } from 'react';
import { Feed, Icon } from 'semantic-ui-react';
import Avatar from 'react-avatar';
import type { FeedModel } from '@dirtleague/common';
import { RatingType } from '@dirtleague/common';
import { useRepositoryServices } from '../../data-access/context';

export interface PlayerFeedProps {
  id: number;
}

export interface PlayerFeedEntryProps {
  model: FeedModel;
}

const PlayerFeedEntry = (props: PlayerFeedEntryProps): ReactElement => {
  const { model } = props;
  const { par, score } = model.card;
  const overall = par - score;
  const type = RatingType[model.rating.type];

  return (
    <Feed.Event key={model.card.id}>
      <Feed.Label>
        <Avatar name={model.player.fullName} size="40" round />
      </Feed.Label>
      <Feed.Content>
        <Feed.Summary>
          <Feed.User>{model.player.fullName}</Feed.User> added a {type} card for{' '}
          {model.course.name}
          <Feed.Date>1 Hour Ago</Feed.Date>
        </Feed.Summary>
        <Feed.Meta>
          <Feed.Like>
            <Icon name="golf ball" />
            {model.rating.rating} rated round | {overall} overall ({score}/{par}{' '}
            on {model.courseLayout.name})
          </Feed.Like>
        </Feed.Meta>
      </Feed.Content>
    </Feed.Event>
  );
};

const PlayerFeed = (props: PlayerFeedProps): ReactElement | null => {
  const { id } = props;
  const services = useRepositoryServices();
  const [results, setResults] = useState<FeedModel[]>();

  useEffect(() => {
    const doWork = async () => {
      const feed = await services.players.getFeed(id);

      setResults(feed);
    };

    doWork();
  }, [id, services.players]);

  if (!results) {
    return null;
  }

  return (
    <Feed>
      {results.map(model => (
        <PlayerFeedEntry model={model} />
      ))}
    </Feed>
  );
};

export default PlayerFeed;
