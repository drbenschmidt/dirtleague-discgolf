import { LinkedList } from 'linked-list-typescript';
import { memo, ReactElement, useCallback, useState } from 'react';
import { Tab, Button, Menu } from 'semantic-ui-react';

export interface TabCollectionProps<TModel> {
  list?: LinkedList<TModel>;
  modelFactory: () => TModel;
  TabComponent: (props: { model: TModel }) => ReactElement;
}

export interface TabModelProps {
  cid: number;
  name: string;
}

function TabCollection<TModel extends TabModelProps>(
  props: TabCollectionProps<TModel>
) {
  const { list, modelFactory, TabComponent } = props;
  const [activeIndex, setActiveIndex] = useState(-1);

  const addButton = (
    <Button
      key="add_layout"
      as="a"
      positive
      style={{ marginLeft: '5px', lineHeight: 'inherit', marginBottom: '5px' }}
      onClick={() => {
        list?.append(modelFactory());

        const newSize = list?.length || 1;
        setActiveIndex(newSize - 1);
      }}
    >
      Add
    </Button>
  );

  const onMenuClick = useCallback((event, { index }) => {
    setActiveIndex(index);
  }, []);

  const layoutPanes =
    list?.toArray().map(entity => {
      return {
        menuItem: (
          <Menu.Item onClick={onMenuClick} key={`menu_${entity.cid}`}>
            {entity.name}
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

  return <Tab panes={panes} activeIndex={activeIndex} />;
}

export default memo(TabCollection);
