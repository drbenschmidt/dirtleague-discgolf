import {
  CardModel,
  CourseLayoutModel,
  EventModel,
  PlayerGroupModel,
  RoundModel,
} from '@dirtleague/common';
import {
  ReactElement,
  memo,
  useEffect,
  useState,
  useRef,
  useCallback,
} from 'react';
import {
  Button,
  Grid,
  Icon,
  Label,
  Message,
  Table,
  Modal,
  SemanticCOLORS,
} from 'semantic-ui-react';
import { useParams } from 'react-router-dom';
import { useRepositoryServices } from '../../data-access/context';
import { EntityDetailsParams } from '../types';
import TabCollection from '../../components/forms/tab-collection';
import FileUpload from '../../components/forms/file-upload';
import useModelState from '../../hooks/useModelState';

interface UploadButtonProps {
  disabled: boolean;
  formData: FormData;
  formPropName: string;
  onUpload: () => Promise<void>;
}

const UploadButton = (props: UploadButtonProps): ReactElement => {
  const { formData, formPropName, onUpload, disabled } = props;
  const [isOpen, setIsOpen] = useState(false);
  const [isInFlight, setIsInFlight] = useState(false);

  const button = (
    <Button primary as="a" disabled={disabled}>
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
      <Modal.Header>Upload File</Modal.Header>
      <Modal.Content>
        <FileUpload formData={formData} formPropName={formPropName} />
      </Modal.Content>
      <Modal.Actions>
        <Button disabled={isInFlight} onClick={() => setIsOpen(false)} negative>
          Cancel
        </Button>
        <Button
          loading={isInFlight}
          onClick={async () => {
            try {
              setIsInFlight(true);
              await onUpload();
              setIsOpen(false);
            } finally {
              setIsInFlight(false);
            }
          }}
          positive
        >
          Upload
        </Button>
      </Modal.Actions>
    </Modal>
  );
};

interface CardDetailsProps {
  model: CardModel;
  layout?: CourseLayoutModel;
  eventId: number;
  isComplete: boolean;
}

const scoreLabelMap = new Map<number, string | null>([
  [-2, 'green'],
  [-1, 'olive'],
  [0, null],
  [1, 'orange'],
  [2, 'red'],
]);

// TODO: Move to common.
const clamper = (min: number, max: number) => (x: number) =>
  Math.max(min, Math.min(x, max));

const CardDetails = (props: CardDetailsProps): ReactElement => {
  const { model, layout, eventId, isComplete } = props;
  const holes = layout?.holes;
  const formDataRef = useRef(new FormData());
  const services = useRepositoryServices();

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

  const onUpload = useCallback(async () => {
    await services?.events.putCard(eventId, model.id, formDataRef.current);
  }, [eventId, model.id, services?.events]);

  const scoreClamper = clamper(-2, 2);

  const getScoreLabel = (score: number, par: number) => {
    const diff = score - par;
    const value = scoreLabelMap.get(scoreClamper(diff));

    if (value) {
      const labelProps = {
        circular: true,
        color: value as SemanticCOLORS,
      };

      return <Label {...labelProps}>{score}</Label>;
    }

    return score;
  };

  return (
    <>
      <Table definition style={{ marginLeft: '5px', marginRight: '5px' }}>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell key="blank" />
            {holes?.toArray().map(hole => (
              <Table.HeaderCell textAlign="center" key={hole.cid}>
                {hole.number}
              </Table.HeaderCell>
            ))}
            <Table.HeaderCell key="total">Total</Table.HeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {model.playerGroups.toArray().map(playerGroup => {
            const scores = playerGroup.results?.toArray();
            const hasScores = (scores?.length ?? 0) > 0;
            let total = 0;
            const getScore = (holeNumber: number) =>
              scores?.find(f => f.courseHoleNumber === holeNumber)?.score || 0;

            return (
              <Table.Row>
                <Table.Cell>{buildPlayerGroup(playerGroup)}</Table.Cell>
                {holes?.toArray().map(hole => {
                  let score = 0;
                  if (playerGroup.results) {
                    score = getScore(hole.number);
                    total += score;
                  }
                  return (
                    <Table.Cell textAlign="center">
                      {hasScores ? getScoreLabel(score, hole.par) : 0}
                    </Table.Cell>
                  );
                })}
                <Table.Cell>{total}</Table.Cell>
              </Table.Row>
            );
          })}
          <Table.Row>
            <Table.Cell>Par</Table.Cell>
            {holes?.toArray().map(hole => (
              <Table.Cell textAlign="center">{hole.par}</Table.Cell>
            ))}
            <Table.Cell>
              {holes?.toArray().reduce((acc, curr) => acc + curr.par, 0)}
            </Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>
      <Grid>
        <Grid.Column width="16" floated="right" textAlign="right">
          <UploadButton
            disabled={isComplete}
            onUpload={onUpload}
            formData={formDataRef.current}
            formPropName="csv"
          />
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
  const services = useRepositoryServices();
  const [isComplete] = useModelState<boolean>(model, 'isComplete');

  const onCompleteClick = useCallback(async () => {
    await services?.events.markRoundComplete(model.id);
    model.isComplete = true;
  }, [model, services?.events]);

  return (
    <>
      <Grid style={{ marginBottom: '10px' }}>
        <Grid.Row>
          <Grid.Column width="8" floated="left">
            <div>Course: {model.course?.name}</div>
            <div>Layout: {model.courseLayout?.name}</div>
          </Grid.Column>
          <Grid.Column width="8" floated="right" textAlign="right">
            <Button
              as="a"
              disabled={isComplete}
              positive
              onClick={onCompleteClick}
            >
              <Icon name="checkmark" />
              Complete
            </Button>
          </Grid.Column>
        </Grid.Row>
      </Grid>
      <div>
        {model.cards.toArray().map((card: CardModel) => (
          <CardDetails
            model={card}
            layout={model.courseLayout}
            eventId={model.eventId}
            isComplete={isComplete}
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
