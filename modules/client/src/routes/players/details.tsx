import { PlayerModel } from '@dirtleague/common';
import { ReactElement, useEffect, useState, lazy, Suspense } from 'react';
import { useParams } from 'react-router-dom';
import {
  Label,
  Grid,
  Image,
  Card,
  Statistic,
  LabelGroup,
} from 'semantic-ui-react';
import { useRepositoryServices } from '../../data-access/context';
import { EntityDetailsParams } from '../types';
import Breadcrumbs from '../../components/generic/breadcrumbs';
import { Players } from '../../links';

const PlayerFeed = lazy(() => import('./feed'));

const formatAverage = (input: string | number | undefined) => {
  if (input === undefined) {
    return 0;
  }

  let value = input;

  if (typeof input === 'string') {
    value = parseFloat(input);
  }

  return Math.floor(value as number);
};

const PlayerDetails = (): ReactElement | null => {
  const { id } = useParams<EntityDetailsParams>();
  const playerId = parseInt(id, 10);
  const services = useRepositoryServices();
  const [result, setResult] = useState<PlayerModel>();

  useEffect(() => {
    const doWork = async () => {
      const players = await services?.players.get(playerId, {
        include: ['aliases'],
      });

      setResult(players);
    };

    doWork();
  }, [playerId, services?.players]);

  if (!result) {
    return null;
  }

  return (
    <>
      <Breadcrumbs
        path={[
          Players.List,
          [Players.Details, { name: result.fullName, id: result.id }],
        ]}
      />
      <Grid stackable style={{ marginTop: '1rem' }}>
        <Grid.Row>
          <Grid.Column computer="4" mobile="16">
            <Card centered>
              <Image src="http://placekitten.com/300/300" wrapped ui={false} />
              <Card.Content>
                <Card.Header>{result.fullName}</Card.Header>
                <Card.Meta>Joined in {result.yearJoined}</Card.Meta>
                <Card.Description>{result.bio}</Card.Description>
              </Card.Content>
              <Card.Content extra>
                <LabelGroup tag>
                  {result.aliases.toArray().map(alias => (
                    <Label key={alias.cid} as="a">
                      {alias.value}
                    </Label>
                  ))}
                </LabelGroup>
              </Card.Content>
            </Card>
          </Grid.Column>
          <Grid.Column computer="12" mobile="16">
            <Statistic.Group style={{ justifyContent: 'center' }}>
              <Statistic>
                <Statistic.Value>
                  {formatAverage(result.stats?.ratings.event)}
                </Statistic.Value>
                <Statistic.Label>Event Rating</Statistic.Label>
              </Statistic>
              <Statistic>
                <Statistic.Value>
                  {formatAverage(result.stats?.ratings.league)}
                </Statistic.Value>
                <Statistic.Label>League Rating</Statistic.Label>
              </Statistic>
              <Statistic>
                <Statistic.Value>
                  {formatAverage(result.stats?.ratings.personal)}
                </Statistic.Value>
                <Statistic.Label>Personal Rating</Statistic.Label>
              </Statistic>
              <Statistic>
                <Statistic.Value>
                  {result.stats?.roundCounts.event}
                </Statistic.Value>
                <Statistic.Label>Events Rounds</Statistic.Label>
              </Statistic>
              <Statistic>
                <Statistic.Value>
                  {result.stats?.roundCounts.league}
                </Statistic.Value>
                <Statistic.Label>League Rounds</Statistic.Label>
              </Statistic>
              <Statistic>
                <Statistic.Value>
                  {result.stats?.roundCounts.personal}
                </Statistic.Value>
                <Statistic.Label>Personal Rounds</Statistic.Label>
              </Statistic>
            </Statistic.Group>
            <div style={{ marginTop: '3rem' }}>
              <Suspense fallback={<div>Loading...</div>}>
                <PlayerFeed id={playerId} />
              </Suspense>
            </div>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </>
  );
};

export default PlayerDetails;
