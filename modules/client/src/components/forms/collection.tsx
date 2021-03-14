/* eslint-disable jsx-a11y/label-has-associated-control */
import { ReactElement, useCallback, useState } from 'react';
import { Table, Menu, Button, Icon, SemanticCOLORS } from 'semantic-ui-react';
import { isNil } from '@dirtleague/common';
import { LinkedList } from 'linked-list-typescript';
import DirtLeagueModel from '@dirtleague/common/src/model/dl-model';

interface CollectionProps<TModel> {
  RowComponent: (props: any) => ReactElement;
  model: React.RefObject<TModel>;
  propName: string;
  label: string;
  buttonText: string;
  tableColor?: SemanticCOLORS;
}

function CollectionComponent<TModel extends DirtLeagueModel<void>>(
  props: CollectionProps<TModel>
): ReactElement {
  const {
    RowComponent,
    model,
    propName,
    label,
    buttonText,
    tableColor,
  } = props;
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
    (obj: TModel) => {
      return () => {
        if (entities?.length === 1) {
          entities?.removeHead();
        } else {
          entities?.remove(obj);
        }
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
      <Table color={tableColor}>
        <Table.Body>
          {entities.toArray().map(entity => (
            // eslint-disable-next-line react/no-array-index-key
            <Table.Row key={`collection_${entity.cid}`}>
              <Table.Cell width="14">
                <RowComponent model={entity} />
              </Table.Cell>
              <Table.Cell textAlign="right" width="2">
                <Button
                  as="a"
                  onClick={onRemoveClick(entity)}
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
