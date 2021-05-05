/* eslint-disable jsx-a11y/alt-text */
import { ReactElement, useEffect, useState } from 'react';
import { Feed, Icon } from 'semantic-ui-react';
import { DateTime } from 'luxon';
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
  const { par, score } = model.group;
  const overall = score - par;
  const type = RatingType[model.rating.type];

  // TODO: The rating is an attribute type, which the date prop is a JS Date.
  // This isn't true when it's coming from the server, it is never converted to a Date
  // from the string it comes from.
  const date = DateTime.fromISO((model.rating.date as unknown) as string);
  const humanizedTime = date.toRelative();

  // Just in case a user without a player profile uploads a card.
  const badPlayerName = !model.player.firstName && !model.player.lastName;
  const playerName = badPlayerName ? 'System User' : model.player.fullName;

  return (
    <Feed.Event key={model.card.id}>
      <Feed.Label>
        <Avatar name={playerName} size="40" round />
      </Feed.Label>
      <Feed.Content>
        <Feed.Summary>
          <Feed.User>{playerName}</Feed.User> added a {type} card for{' '}
          {model.course.name}
          <Feed.Date>{humanizedTime}</Feed.Date>
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
        <PlayerFeedEntry model={model} key={model.rating.id} />
      ))}
    </Feed>
  );
};

export default PlayerFeed;
