/* eslint-disable jsx-a11y/label-has-associated-control */
import { ReactElement, useCallback, useState } from 'react';
import { Table, Button, Icon, Popup, SemanticCOLORS } from 'semantic-ui-react';
import { LinkedList } from 'linked-list-typescript';
import DirtLeagueModel from '@dirtleague/common/src/model/dl-model';

interface CollectionProps<TModel> {
  RowComponent: (props: { model: TModel }) => ReactElement;
  list?: LinkedList<TModel>;
  label: string;
  buttonText: string;
  tableColor?: SemanticCOLORS;
  modelFactory: () => TModel;
  helpText?: string;
}

function CollectionComponent<TModel extends DirtLeagueModel<void>>(
  props: CollectionProps<TModel>
): ReactElement {
  const {
    RowComponent,
    list,
    label,
    buttonText,
    tableColor,
    modelFactory,
    helpText,
  } = props;
  const [, setDummy] = useState(false);

  const onAddClick = useCallback(() => {
    list?.append(modelFactory());
    setDummy(v => !v);
  }, [list, modelFactory]);

  const onRemoveClick = useCallback(
    (obj: TModel) => {
      return () => {
        if (list?.length === 1) {
          list?.removeHead();
        } else {
          list?.remove(obj);
        }
        setDummy(v => !v);
      };
    },
    [list]
  );

  return (
    <>
      <div className="field">
        <label>
          {label}
          {helpText && (
            <Popup
              trigger={
                <Icon
                  style={{ boxShadow: 'none' }}
                  circular
                  name="question circle"
                />
              }
              content={helpText}
              size="small"
            />
          )}
        </label>
      </div>
      <Table color={tableColor}>
        <Table.Body>
          {list?.toArray().map(entity => (
            // eslint-disable-next-line react/no-array-index-key
            <Table.Row key={`collection_${entity.cid}`}>
              <Table.Cell width="14">
                <RowComponent model={entity} />
              </Table.Cell>
              <Table.Cell verticalAlign="top" textAlign="right" width="2">
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
            <Table.HeaderCell colSpan="4" textAlign="right">
              <Button basic as="a" onClick={onAddClick}>
                <Icon name="add circle" /> {buttonText}
              </Button>
            </Table.HeaderCell>
          </Table.Row>
        </Table.Footer>
      </Table>
    </>
  );
}

export default CollectionComponent;
