/* eslint-disable jsx-a11y/label-has-associated-control */
import { LinkedList } from 'linked-list-typescript';
import { memo, ReactElement, useCallback, useState } from 'react';
import { Tab, Button, Menu, Label, Icon } from 'semantic-ui-react';

export interface TabCollectionProps<TModel> {
  list?: LinkedList<TModel>;
  modelFactory?: () => TModel;
  TabComponent: (props: any) => ReactElement;
  label?: string;
  mode: 'form' | 'details';
}

export interface TabModelProps {
  cid: number;
  name: string;
}

function TabCollection<TModel extends TabModelProps>(
  props: TabCollectionProps<TModel>
) {
  const { list, modelFactory, TabComponent, label, mode = 'form' } = props;
  const [activeIndex, setActiveIndex] = useState(() => {
    if ((list?.length || 0) > 0) {
      return 0;
    }

    return -1;
  });
  const [, setDummy] = useState(false);
  const isFormMode = mode === 'form';

  const addButton = (
    <Button
      key="add_layout"
      as="a"
      positive
      style={{ marginLeft: '15px', lineHeight: 'inherit', marginBottom: '5px' }}
      onClick={() => {
        if (!modelFactory) {
          return;
        }

        list?.append(modelFactory());

        const newSize = list?.length || 1;
        setActiveIndex(newSize - 1);
        setDummy(d => !d);
      }}
    >
      Add
    </Button>
  );

  const onMenuClick = useCallback((event, { index }) => {
    setActiveIndex(index);
  }, []);

  const onMenuRemoveClick = useCallback(
    (event, data) => {
      if (data.entity) {
        if (list?.length === 1) {
          list?.removeHead();
        } else {
          list?.remove(data.entity);
        }
        setActiveIndex(-1);
        setDummy(d => !d);
      }
    },
    [list]
  );

  const tabPanes =
    list?.toArray().map(entity => {
      return {
        menuItem: (
          <Menu.Item
            onClick={onMenuClick}
            key={`menu_${entity.cid}`}
            style={{ marginRight: '15px' }}
          >
            {entity.name}
            {isFormMode && (
              <Label
                color="red"
                floating
                entity={entity}
                onClick={onMenuRemoveClick}
              >
                <Icon name="x" style={{ marginRight: 0 }} />
              </Label>
            )}
          </Menu.Item>
        ),
        render: () => (
          <Tab.Pane>
            <TabComponent key={entity.cid} model={entity} />
          </Tab.Pane>
        ),
      };
    }) || [];

  if (isFormMode) {
    tabPanes.push({ menuItem: addButton, render: () => <Tab.Pane /> });
  }

  return (
    <>
      {label && (
        <div className="field">
          <label>{label}</label>
        </div>
      )}
      <Tab renderActiveOnly panes={tabPanes} activeIndex={activeIndex} />
    </>
  );
}

export default memo(TabCollection);
