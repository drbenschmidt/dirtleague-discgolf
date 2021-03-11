import { CourseLayoutModel, CourseModel } from '@dirtleague/common';
import { ReactElement, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Grid, Table, Tab, Statistic } from 'semantic-ui-react';
import { useRepositoryServices } from '../../data-access/context';
import { EntityDetailsParams } from '../types';

const CourseLayoutDetails = (props: {
  model: CourseLayoutModel;
}): ReactElement => {
  const { model } = props;

  const holesArray = Array.from(model.holes);

  return (
    <Grid>
      <Grid.Row>
        <Grid.Column>
          <Statistic.Group widths="2">
            <Statistic label="Length" value={model.holes.length} />
            <Statistic label="Scratch Score Estimate" value={model.dgcrSse} />
          </Statistic.Group>
        </Grid.Column>
      </Grid.Row>
      <Grid.Row style={{ overflowX: 'scroll' }}>
        <Table definition style={{ marginLeft: '5px', marginRight: '5px' }}>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell key="blank" />
              {holesArray.map(hole => (
                <Table.HeaderCell key={hole.cid}>
                  {hole.number}
                </Table.HeaderCell>
              ))}
            </Table.Row>
          </Table.Header>

          <Table.Body>
            <Table.Row>
              <Table.Cell>Distance</Table.Cell>
              {holesArray.map(hole => (
                <Table.Cell>{hole.distance}</Table.Cell>
              ))}
            </Table.Row>
            <Table.Row>
              <Table.Cell>Par</Table.Cell>
              {holesArray.map(hole => (
                <Table.Cell>{hole.par}</Table.Cell>
              ))}
            </Table.Row>
          </Table.Body>
        </Table>
      </Grid.Row>
    </Grid>
  );
};

const CourseDetails = (): ReactElement | null => {
  const { id } = useParams<EntityDetailsParams>();
  const services = useRepositoryServices();
  const [result, setResult] = useState<CourseModel>();

  useEffect(() => {
    const doWork = async () => {
      const entity = await services?.courses.get(parseInt(id, 10), {
        include: ['layouts', 'holes'],
      });

      setResult(entity);
    };

    doWork();
  }, [id, services?.courses]);

  if (!result) {
    return null;
  }

  const panes =
    result.layouts.toArray().map(layout => {
      return {
        menuItem: layout.name,
        render: () => (
          <Tab.Pane>
            <CourseLayoutDetails key={layout.cid} model={layout} />
          </Tab.Pane>
        ),
      };
    }) || [];

  return (
    <>
      <h1>Course {result.name}</h1>
      <Tab panes={panes} />
    </>
  );
};

export default CourseDetails;
