import { PlayerModel } from '@dirtleague/common';
import { ReactElement, useEffect, useState } from 'react';
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
          <Grid.Column width="12">
            <Statistic.Group>
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
            </Statistic.Group>
            <Statistic.Group>
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
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </>
  );
};

export default PlayerDetails;
