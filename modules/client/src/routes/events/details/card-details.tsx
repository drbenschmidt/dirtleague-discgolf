import {
  CardModel,
  CourseLayoutModel,
  PlayerGroupModel,
  clamper,
} from '@dirtleague/common';
import { ReactElement, useRef, useCallback } from 'react';
import { Grid, Label, Table, SemanticCOLORS } from 'semantic-ui-react';
import { useRepositoryServices } from '../../../data-access/context';
import UploadButton from './upload-button';

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
      <Table
        unstackable
        definition
        style={{ marginLeft: '5px', marginRight: '5px' }}
      >
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

export default CardDetails;
