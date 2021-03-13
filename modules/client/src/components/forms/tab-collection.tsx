/* eslint-disable jsx-a11y/label-has-associated-control */
import { LinkedList } from 'linked-list-typescript';
import { memo, ReactElement, useCallback, useState } from 'react';
import { Tab, Button, Menu, Label, Icon } from 'semantic-ui-react';

export interface TabCollectionProps<TModel> {
  list?: LinkedList<TModel>;
  modelFactory: () => TModel;
  TabComponent: (props: { model: TModel }) => ReactElement;
  label: string;
}

export interface TabModelProps {
  cid: number;
  name: string;
}

function TabCollection<TModel extends TabModelProps>(
  props: TabCollectionProps<TModel>
) {
  const { list, modelFactory, TabComponent, label } = props;
  const [activeIndex, setActiveIndex] = useState(-1);
  const [, setDummy] = useState(false);

  const addButton = (
    <Button
      key="add_layout"
      as="a"
      positive
      style={{ marginLeft: '15px', lineHeight: 'inherit', marginBottom: '5px' }}
      onClick={() => {
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

  const layoutPanes =
    list?.toArray().map(entity => {
      return {
        menuItem: (
          <Menu.Item
            onClick={onMenuClick}
            key={`menu_${entity.cid}`}
            style={{ marginRight: '15px' }}
          >
            {entity.name}
            <Label
              color="red"
              floating
              entity={entity}
              onClick={onMenuRemoveClick}
            >
              <Icon name="x" style={{ marginRight: 0 }} />
            </Label>
          </Menu.Item>
        ),
        render: () => (
          <Tab.Pane>
            <TabComponent key={entity.cid} model={entity} />
          </Tab.Pane>
        ),
      };
    }) || [];

  const panes = [
    ...layoutPanes,
    { menuItem: addButton, render: () => <Tab.Pane /> },
  ];

  return (
    <>
      <div className="field">
        <label>{label}</label>
      </div>
      <Tab renderActiveOnly panes={panes} activeIndex={activeIndex} />
    </>
  );
}

export default memo(TabCollection);
