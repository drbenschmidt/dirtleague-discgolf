import {
  CardModel,
  CourseLayoutModel,
  EventModel,
  PlayerGroupModel,
  RoundModel,
} from '@dirtleague/common';
import { ReactElement, memo, useEffect, useState } from 'react';
import { Button, Grid, Icon, Label, Message, Table } from 'semantic-ui-react';
import { useParams } from 'react-router-dom';
import { useRepositoryServices } from '../../data-access/context';
import { EntityDetailsParams } from '../types';
import TabCollection from '../../components/forms/tab-collection';

interface CardDetailsProps {
  model: CardModel;
  layout?: CourseLayoutModel;
}

const CardDetails = (props: CardDetailsProps): ReactElement => {
  const { model, layout } = props;

  const holes = layout?.holes;

  const buildPlayerGroup = (playerGroup: PlayerGroupModel) => {
    const teamName =
      playerGroup.teamName.length > 0 ? (
        <Label ribbon>{playerGroup.teamName}</Label>
      ) : null;

    return (
      <div>
        {teamName}
        <div>
          {playerGroup.players.toArray().map(player => (
            <div>{player.player?.fullName}</div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <>
      <Table definition style={{ marginLeft: '5px', marginRight: '5px' }}>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell key="blank" />
            {holes?.toArray().map(hole => (
              <Table.HeaderCell key={hole.cid}>{hole.number}</Table.HeaderCell>
            ))}
            <Table.HeaderCell key="total">Total</Table.HeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {model.playerGroups.toArray().map(playerGroup => {
            return (
              <Table.Row>
                <Table.Cell>{buildPlayerGroup(playerGroup)}</Table.Cell>
                {holes?.toArray().map(hole => (
                  <Table.Cell>0</Table.Cell>
                ))}
                <Table.Cell>0</Table.Cell>
              </Table.Row>
            );
          })}
          <Table.Row>
            <Table.Cell>Par</Table.Cell>
            {holes?.toArray().map(hole => (
              <Table.Cell>{hole.par}</Table.Cell>
            ))}
            <Table.Cell>
              {holes?.toArray().reduce((acc, curr) => acc + curr.par, 0)}
            </Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>
      <Grid>
        <Grid.Column width="16" floated="right" textAlign="right">
          <Button primary as="a">
            <Icon name="cloud upload" />
            Upload uDisc CSV
          </Button>
        </Grid.Column>
      </Grid>
    </>
  );
};

interface RoundDetailsProps {
  model: RoundModel;
}

const RoundDetails = (props: RoundDetailsProps): ReactElement => {
  const { model } = props;

  return (
    <>
      <div>Course: {model.course?.name}</div>
      <div>Layout: {model.courseLayout?.name}</div>
      <div>
        {model.cards.toArray().map(card => (
          <CardDetails model={card} layout={model.courseLayout} />
        ))}
      </div>
    </>
  );
};

const EventDetails = (): ReactElement | null => {
  const { id } = useParams<EntityDetailsParams>();
  const services = useRepositoryServices();
  const [result, setResult] = useState<EventModel>();

  useEffect(() => {
    const doWork = async () => {
      const event = await services?.events.get(parseInt(id, 10), {
        include: ['rounds'],
      });

      setResult(event);
    };

    doWork();
  }, [id, services?.events]);

  if (!result) {
    return null;
  }

  return (
    <>
      <h1>{result.name}</h1>
      <Message>
        <Message.Header>Description</Message.Header>
        <p>{result.description}</p>
      </Message>
      <TabCollection
        mode="details"
        TabComponent={RoundDetails}
        list={result?.rounds}
      />
    </>
  );
};

export default memo(EventDetails);
