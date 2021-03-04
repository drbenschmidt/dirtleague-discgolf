/* eslint-disable jsx-a11y/label-has-associated-control */

import { ReactElement, useCallback, useState } from 'react';
import { Table, Menu, Button, Icon } from 'semantic-ui-react';
import { ListNode, LinkedList, isNil } from '@dirtleague/common';

interface CollectionProps<TModel> {
  RowComponent: (props: any) => ReactElement;
  model: React.RefObject<TModel>;
  propName: string;
  label: string;
  buttonText: string;
}

function CollectionComponent<TModel>(
  props: CollectionProps<TModel>
): ReactElement {
  const { RowComponent, model, propName, label, buttonText } = props;
  let entities = (model.current as any)[propName] as LinkedList<TModel>;
  const [, setDummy] = useState(false);

  if (isNil(entities)) {
    (model.current as any)[propName] = new LinkedList<TModel>();
    entities = new LinkedList<TModel>();
  }

  const onAddClick = useCallback(() => {
    entities.append({} as TModel);
    setDummy(v => !v);
  }, [entities]);

  const onRemoveClick = useCallback(
    (obj: ListNode<TModel>) => {
      return () => {
        entities.deleteNode(obj);
        setDummy(v => !v);
      };
    },
    [entities]
  );

  return (
    <>
      <div className="field">
        <label>{label}</label>
      </div>
      <Table>
        <Table.Body>
          {entities.mapReact(node => (
            // eslint-disable-next-line react/no-array-index-key
            <Table.Row key={`collection_${node.id}`}>
              <Table.Cell width="14">
                <RowComponent model={node.data} />
              </Table.Cell>
              <Table.Cell textAlign="right" width="2">
                <Button
                  as="a"
                  onClick={onRemoveClick(node)}
                  negative
                  size="mini"
                >
                  <Icon name="delete" />
                  Remove
                </Button>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
        <Table.Footer>
          <Table.Row>
            <Table.HeaderCell colSpan="4">
              <Menu floated="right">
                <Menu.Item as="a" onClick={onAddClick} type="Button">
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

export default CollectionComponent;
