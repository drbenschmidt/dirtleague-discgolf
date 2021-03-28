import { DirtLeagueModel } from '@dirtleague/common';
import { CSSProperties, ReactElement, useRef } from 'react';
import { Table } from 'semantic-ui-react';
import { useInputBinding } from '../../hooks/forms';
import TextInput from './text-input';

export interface TableCellInputProps<TModel extends DirtLeagueModel<unknown>> {
  model: TModel;
  name: string;
  style?: CSSProperties;
}

function TableCellInput<TModel extends DirtLeagueModel<unknown>>(
  props: TableCellInputProps<TModel>
): ReactElement {
  const { model, name, style } = props;
  const modelRef = useRef(model);
  const bindings = useInputBinding(modelRef, name);

  return (
    <Table.HeaderCell>
      <TextInput {...bindings} type="number" size="mini" style={style} />
    </Table.HeaderCell>
  );
}

export default TableCellInput;
