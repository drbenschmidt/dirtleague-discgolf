/* eslint-disable jsx-a11y/label-has-associated-control */
import { ReactElement, useCallback, useState } from 'react';
import { Table, Menu, Button, Icon } from 'semantic-ui-react';

interface CollectionProps<TModel> {
  RowComponent: (props: any) => ReactElement;
  model: React.RefObject<TModel>;
  propName: string;
  label: string;
  buttonText: string;
}

function Collection<TModel>(props: CollectionProps<TModel>): ReactElement {
  const { RowComponent, model, propName, label, buttonText } = props;
  let entities = (model.current as any)[propName] as TModel[];
  const [, setDummy] = useState(false);

  if (!Array.isArray(entities)) {
    (model.current as any)[propName] = [] as TModel[];
    entities = [] as TModel[];
  }

  const onAddClick = useCallback(() => {
    entities.push({} as TModel);
    setDummy(v => !v);
  }, [entities]);

  return (
    <>
      <div className="field">
        <label>{label}</label>
      </div>
      <Table>
        <Table.Body>
          {entities.map(entity => (
            <Table.Row>
              <RowComponent model={entity} />
            </Table.Row>
          ))}
        </Table.Body>
        <Table.Footer>
          <Table.Row>
            <Table.HeaderCell colSpan="4">
              <Menu floated="right">
                <Menu.Item as={Button} onClick={onAddClick} type="Button">
                  <Icon name="add circle" /> {buttonText}
                </Menu.Item>
              </Menu>
            </Table.HeaderCell>
          </Table.Row>
        </Table.Footer>
      </Table>
    </>
  );
}

export default Collection;
