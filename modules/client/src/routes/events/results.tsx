import {
  CourseLayoutModel,
  EventModel,
  PlayerGroupModel,
  RoundModel,
  clamper,
} from '@dirtleague/common';
import { ReactElement, memo, useEffect, useState } from 'react';
import { Grid, Label, Table, SemanticCOLORS } from 'semantic-ui-react';
import { useParams } from 'react-router-dom';
import { useRepositoryServices } from '../../data-access/context';
import { EntityDetailsParams } from '../types';
import TabCollection from '../../components/forms/tab-collection';
import Breadcrumbs from '../../components/generic/breadcrumbs';
import { Events } from '../../links';

interface RoundAggregate {
  playerGroup: PlayerGroupModel;
  score: number | undefined;
}

interface CombinedCardResultsProps {
  model: RoundAggregate[];
  layout?: CourseLayoutModel;
}

const scoreLabelMap = new Map<number, string | null>([
  [-2, 'green'],
  [-1, 'olive'],
  [0, null],
  [1, 'orange'],
  [2, 'red'],
]);

const CombinedCardResults = (props: CombinedCardResultsProps): ReactElement => {
  const { model, layout } = props;
  const holes = layout?.holes;
  const layoutPar = holes?.toArray().reduce((acc, curr) => acc + curr.par, 0);

  const buildPlayerGroup = (playerGroup: PlayerGroupModel) => {
    const teamName =
      playerGroup.teamName.length > 0 ? (
        <Label ribbon>{playerGroup.teamName}</Label>
      ) : null;

    const { rating } = playerGroup.players.head;

    return (
      <div>
        {teamName}
        <div>
          {playerGroup.players.toArray().map(player => (
            <div>{player.player?.fullName}</div>
          ))}
        </div>
        <div>{rating}</div>
      </div>
    );
  };

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
          {model.map(result => {
            const scores = result.playerGroup.results?.toArray();
            const hasScores = (scores?.length ?? 0) > 0;
            let total = 0;
            const getScore = (holeNumber: number) =>
              scores?.find(f => f.courseHoleNumber === holeNumber)?.score || 0;
            const diffElement = () =>
              layoutPar ? <>({total - layoutPar})</> : null;

            return (
              <Table.Row>
                <Table.Cell>{buildPlayerGroup(result.playerGroup)}</Table.Cell>
                {holes?.toArray().map(hole => {
                  let score = 0;
                  if (result.playerGroup.results) {
                    score = getScore(hole.number);
                    total += score;
                  }
                  return (
                    <Table.Cell textAlign="center">
                      {hasScores ? getScoreLabel(score, hole.par) : 0}
                    </Table.Cell>
                  );
                })}
                <Table.Cell>
                  {total} {diffElement()}
                </Table.Cell>
              </Table.Row>
            );
          })}
          <Table.Row>
            <Table.Cell>Par</Table.Cell>
            {holes?.toArray().map(hole => (
              <Table.Cell textAlign="center">{hole.par}</Table.Cell>
            ))}
            <Table.Cell>{layoutPar}</Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>
    </>
  );
};

interface RoundResultsProps {
  model: RoundModel;
}

const RoundResults = (props: RoundResultsProps): ReactElement => {
  const { model } = props;

  const results = model.cards
    .toArray()
    .flatMap(c =>
      c.playerGroups.toArray().map(p => ({
        playerGroup: p,
        score: p.results
          ?.toArray()
          .map(r => r.score)
          .reduce((acc, curr) => acc + curr, 0),
      }))
    )
    .sort((a, b) => (a.score || 0) - (b.score || 0)) as RoundAggregate[];

  return (
    <>
      <Grid style={{ marginBottom: '10px' }}>
        <Grid.Row>
          <Grid.Column width="8" floated="left">
            <div>Course: {model.course?.name}</div>
            <div>Layout: {model.courseLayout?.name}</div>
          </Grid.Column>
        </Grid.Row>
      </Grid>
      <CombinedCardResults model={results} layout={model.courseLayout} />
    </>
  );
};

const EventResults = (): ReactElement | null => {
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

  const { name } = result;

  return (
    <>
      <Breadcrumbs path={[Events.List, [Events.Results, { name }]]} />
      <h1>{result.name} Results</h1>
      <TabCollection
        mode="details"
        TabComponent={RoundResults}
        list={result?.rounds}
      />
    </>
  );
};

export default memo(EventResults);
