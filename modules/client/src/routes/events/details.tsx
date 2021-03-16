import {
  CardModel,
  CourseLayoutModel,
  EventModel,
  PlayerGroupModel,
  RoundModel,
} from '@dirtleague/common';
import { ReactElement, memo, useEffect, useState, useRef } from 'react';
import {
  Button,
  Grid,
  Icon,
  Label,
  Message,
  Table,
  Modal,
  Form,
  Ref,
} from 'semantic-ui-react';
import { useParams } from 'react-router-dom';
import { useRepositoryServices } from '../../data-access/context';
import { EntityDetailsParams } from '../types';
import TabCollection from '../../components/forms/tab-collection';
import FileUpload from '../../components/forms/file-upload';

const UploadButton = (props: any): ReactElement => {
  const { destination, modelName, id } = props;
  const [isOpen, setIsOpen] = useState(false);
  const [isInFlight, setIsInFlight] = useState(false);
  const formRef = useRef(null);

  const button = (
    <Button primary as="a">
      <Icon name="cloud upload" />
      Upload uDisc CSV
    </Button>
  );

  return (
    <Modal
      open={isOpen}
      onOpen={() => setIsOpen(true)}
      onClose={() => setIsOpen(false)}
      trigger={button}
    >
      <Modal.Header>Delete {modelName}</Modal.Header>
      <Modal.Content>
        <Ref innerRef={formRef}>
          <Form method="POST" action={destination}>
            <FileUpload />
          </Form>
        </Ref>
      </Modal.Content>
      <Modal.Actions>
        <Button disabled={isInFlight} onClick={() => setIsOpen(false)} negative>
          No
        </Button>
        <Button
          loading={isInFlight}
          onClick={() => {
            setIsOpen(false);
            if (!formRef.current) {
              return;
            }
            console.log(formRef.current);
            (formRef.current as any).submit();
          }}
          positive
        >
          Yes
        </Button>
      </Modal.Actions>
    </Modal>
  );
};

interface CardDetailsProps {
  model: CardModel;
  layout?: CourseLayoutModel;
  eventId: number;
}

const CardDetails = (props: CardDetailsProps): ReactElement => {
  const { model, layout, eventId } = props;

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
          <UploadButton destination={`/events/${eventId}/card/${model.id}`} />
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
        {model.cards.toArray().map((card: CardModel) => (
          <CardDetails
            model={card}
            layout={model.courseLayout}
            eventId={model.eventId}
          />
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
