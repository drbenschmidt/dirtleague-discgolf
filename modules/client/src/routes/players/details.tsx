import { PlayerModel } from '@dirtleague/common';
import { ReactElement, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Label, Grid, Image, Card, Statistic } from 'semantic-ui-react';
import { useRepositoryServices } from '../../data-access/context';
import { EntityDetailsParams } from '../types';
import Breadcrumbs from '../../components/generic/breadcrumbs';
import { Players } from '../../links';

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
    <>
      <Breadcrumbs
        path={[
          Players.List,
          [Players.Details, { name: result.fullName, id: result.id }],
        ]}
      />
      <Grid style={{ marginTop: '1rem' }}>
        <Grid.Row>
          <Grid.Column width="4">
            <Card>
              <Image src="http://placekitten.com/300/300" wrapped ui={false} />
              <Card.Content>
                <Card.Header>{result.fullName}</Card.Header>
                <Card.Meta>Joined in {result.yearJoined}</Card.Meta>
                <Card.Description>{result.bio}</Card.Description>
              </Card.Content>
              <Card.Content extra>
                {result.aliases.toArray().map(alias => (
                  <Label key={alias.cid} as="a" tag>
                    {alias.value}
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
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </>
  );
};

export default PlayerDetails;
