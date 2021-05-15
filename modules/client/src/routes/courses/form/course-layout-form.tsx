import { ReactElement, useCallback, useState, useRef } from 'react';
import { CourseLayoutModel, CourseHoleModel } from '@dirtleague/common';
import { Form, Grid, Table } from 'semantic-ui-react';
import TextInput from '../../../components/forms/text-input';
import SelectInput from '../../../components/forms/select-input';
import TableCellInput from '../../../components/forms/table-cell-input';
import { useInputBinding } from '../../../hooks/forms';

const CourseLengthOptions = [
  { text: '9', value: 9 },
  { text: '18', value: 18 },
  { text: '27', value: 27 },
];

const Styles = {
  header: { width: '75px' },
  cell: { width: '75px' },
};

const CourseLayoutForm = (props: {
  model: CourseLayoutModel;
}): ReactElement => {
  const { model } = props;
  const modelRef = useRef(model);
  const nameBindings = useInputBinding(modelRef, 'name');
  const dgcrSseBindings = useInputBinding(modelRef, 'dgcrSse');
  const [holesArray, setHolesArray] = useState(Array.from(model.holes));
  const [holesArrayLength, setHolesArrayLength] = useState(model.holes.length);
  const onCountChange = useCallback(
    (event, newValue) => {
      const value = parseInt(newValue, 10);
      const currentValue = model.holes.length;

      if (value > currentValue) {
        // Add the difference.
        const diff = value - currentValue;
        for (let i = 1; i <= diff; i++) {
          model.holes.append(
            new CourseHoleModel({
              number: currentValue + i,
            })
          );
        }
      } else if (value < currentValue) {
        // Remove from end
        const diff = currentValue - value;
        for (let i = 1; i <= diff; i++) {
          model.holes.removeTail();
        }
      } else {
        return;
      }

      setHolesArray(Array.from(model.holes));
      setHolesArrayLength(model.holes.length);
    },
    [model.holes]
  );

  return (
    <Grid>
      <Grid.Row>
        <Grid.Column>
          <Form.Group widths="equal">
            <TextInput {...nameBindings} label="Layout Name" />
            <SelectInput
              onChange={onCountChange}
              options={CourseLengthOptions}
              value={holesArrayLength}
              label="Length"
            />
            <TextInput {...dgcrSseBindings} label="DGCR SSE" />
          </Form.Group>
        </Grid.Column>
      </Grid.Row>
      <Grid.Row style={{ overflowX: 'scroll' }}>
        <Table
          unstackable
          definition
          style={{ marginLeft: '5px', marginRight: '5px' }}
        >
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell key="blank" style={Styles.cell} />
              {holesArray.map(hole => (
                <Table.HeaderCell key={hole.cid} style={Styles.header}>
                  {hole.number}
                </Table.HeaderCell>
              ))}
            </Table.Row>
          </Table.Header>

          <Table.Body>
            <Table.Row>
              <Table.Cell>Distance</Table.Cell>
              {holesArray.map(hole => (
                <TableCellInput
                  key={hole.cid}
                  model={hole}
                  name="distance"
                  style={Styles.cell}
                />
              ))}
            </Table.Row>
            <Table.Row>
              <Table.Cell>Par</Table.Cell>
              {holesArray.map(hole => (
                <TableCellInput
                  key={hole.cid}
                  model={hole}
                  name="par"
                  style={Styles.cell}
                />
              ))}
            </Table.Row>
          </Table.Body>
        </Table>
      </Grid.Row>
    </Grid>
  );
};

export default CourseLayoutForm;
