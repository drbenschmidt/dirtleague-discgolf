import { PlayerModel } from '@dirtleague/common';
import { lazy, ReactElement, useEffect, useState, Suspense } from 'react';
import { useParams } from 'react-router-dom';
import { Label, Grid, Image, Card, Statistic } from 'semantic-ui-react';
import { useRepositoryServices } from '../../data-access/context';
import { EntityDetailsParams } from '../types';

const LazyRatingChart = lazy(() => import('./rating-chart'));

const PlayerDetails = (): ReactElement | null => {
  const { id } = useParams<EntityDetailsParams>();
  const services = useRepositoryServices();
  const [result, setResult] = useState<PlayerModel>();

  useEffect(() => {
    const doWork = async () => {
      const players = await services?.players.get(parseInt(id, 10), {
        include: ['aliases'],
      });

      setResult(players);
    };

    doWork();
  }, [id, services?.players]);

  if (!result) {
    return null;
  }

  return (
    <Grid>
      <Grid.Row>
        <Grid.Column width="4">
          <Card>
            <Label color="red" ribbon style={{ left: '-1rem' }}>
              3rd Place
            </Label>
            <Image src="http://placekitten.com/300/300" wrapped ui={false} />
            <Card.Content>
              <Card.Header>{`${result.firstName} ${result.lastName}`}</Card.Header>
              <Card.Meta>Joined in 2021</Card.Meta>
              <Card.Description>
                Lorem Ipsum or something, idk man.
              </Card.Description>
            </Card.Content>
            <Card.Content extra>
              {result.aliases.mapReact(alias => (
                <Label key={alias.id} as="a" tag>
                  {alias.data.value}
                </Label>
              ))}
            </Card.Content>
          </Card>
        </Grid.Column>
        <Grid.Column width="12">
          <Statistic.Group>
            <Statistic>
              <Statistic.Value>{result.currentRating}</Statistic.Value>
              <Statistic.Label>Current Rating</Statistic.Label>
            </Statistic>
            <Statistic>
              <Statistic.Value>230</Statistic.Value>
              <Statistic.Label>Rounds Played</Statistic.Label>
            </Statistic>
            <Statistic>
              <Statistic.Value>-4</Statistic.Value>
              <Statistic.Label>Best Round (singles)</Statistic.Label>
            </Statistic>
            <Statistic>
              <Statistic.Value>-12</Statistic.Value>
              <Statistic.Label>Best Round (doubles)</Statistic.Label>
            </Statistic>
          </Statistic.Group>
          <Suspense fallback={<div>Loading...</div>}>
            <LazyRatingChart />
          </Suspense>
        </Grid.Column>
      </Grid.Row>
    </Grid>
  );
};

export default PlayerDetails;
