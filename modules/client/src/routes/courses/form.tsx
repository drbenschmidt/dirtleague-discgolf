import { ReactElement, useCallback, useEffect, useState, memo } from 'react';
import { isNil, CourseModel, CourseLayoutModel } from '@dirtleague/common';
import { useParams, useHistory } from 'react-router-dom';
import { Form, Tab, Button, Menu, Grid, Table } from 'semantic-ui-react';
import TextInput from '../../components/forms/text-input';
import { useRepositoryServices } from '../../data-access/context';
import { useInputBinding, useTransaction } from '../../hooks/forms';
import { EntityDetailsParams } from '../types';

const CourseLayoutForm = (props: {
  model: CourseLayoutModel;
}): ReactElement => {
  const { model } = props;

  return (
    <Grid>
      <Grid.Row>
        <Grid.Column>{model.name}</Grid.Column>
      </Grid.Row>
      <Grid.Row>
        <Table definition style={{ marginLeft: '5px', marginRight: '5px' }}>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell />
              {model.holes.mapReact(hole => (
                <Table.HeaderCell>{hole.data.number}</Table.HeaderCell>
              ))}
            </Table.Row>
          </Table.Header>

          <Table.Body>
            <Table.Row>
              <Table.Cell>Distance</Table.Cell>
              {model.holes.mapReact(hole => (
                <Table.Cell>{hole.data.distance}</Table.Cell>
              ))}
            </Table.Row>
            <Table.Row>
              <Table.Cell>Par</Table.Cell>
              {model.holes.mapReact(hole => (
                <Table.Cell>{hole.data.par}</Table.Cell>
              ))}
            </Table.Row>
          </Table.Body>
        </Table>
      </Grid.Row>
    </Grid>
  );
};

const CourseFormComponent = (props: any): ReactElement | null => {
  const { entityModel, isEditing, services } = props;
  const { model } = useTransaction<CourseModel>(entityModel);
  const nameBinding = useInputBinding(model, 'name');
  const [isInFlight, setIsInFlight] = useState(false);
  const history = useHistory();
  const [activeIndex, setActiveIndex] = useState(-1);

  const onFormSubmit = useCallback(() => {
    const submit = async () => {
      if (model.current) {
        try {
          setIsInFlight(true);
          if (isEditing) {
            await services?.courses.update(model.current);

            history.push(`/courses/${model.current.id}`);
          } else {
            await services?.courses.create(model.current);

            // TODO: Move to course view?
            history.push('/courses');
          }
        } finally {
          setIsInFlight(false);
        }
      }
    };

    submit();
  }, [isEditing, model, services?.courses, history]);

  const addButton = (
    <Button
      as="a"
      positive
      style={{ marginLeft: '5px', lineHeight: 'inherit', marginBottom: '5px' }}
      onClick={() => {
        model.current?.layouts.append(CourseLayoutModel.createDefault());
        const newSize = model.current?.layouts.size() || 1;
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
    model.current?.layouts.mapReact(layout => {
      return {
        menuItem: (
          <Menu.Item onClick={onMenuClick} key={`menu_${layout.id}`}>
            {layout.data.name}
          </Menu.Item>
        ),
        render: () => (
          <Tab.Pane>
            <CourseLayoutForm key={layout.id} model={layout.data} />
          </Tab.Pane>
        ),
      };
    }) || [];

  const panes = [
    ...layoutPanes,
    { menuItem: addButton, render: () => <Tab.Pane /> },
  ];

  console.log(activeIndex);

  return (
    <>
      <h1>{isEditing ? 'Edit Course' : 'New Course'}</h1>
      <Form onSubmit={onFormSubmit} loading={isInFlight}>
        <Form.Group widths="equal">
          <TextInput
            {...nameBinding}
            fluid
            label="Name"
            placeholder="Course Name"
          />
        </Form.Group>
        <Tab panes={panes} activeIndex={activeIndex} />
        <Form.Button positive content="Submit" />
      </Form>
    </>
  );
};

const CourseForm = (): ReactElement | null => {
  const { id } = useParams<EntityDetailsParams>();
  const isEditing = !isNil(id);
  const services = useRepositoryServices();
  const [entityModel, setEntityModel] = useState<CourseModel>();

  // Get the entity from the server if we're editing it.
  useEffect(() => {
    if (isEditing) {
      const getCourse = async () => {
        const response = await services?.courses.get(parseInt(id, 10), {
          include: ['layouts', 'holes'],
        });

        if (response) {
          setEntityModel(response);
        }
      };

      getCourse();
    } else {
      const response = new CourseModel();

      setEntityModel(response);
    }
  }, [id, isEditing, services?.courses]);

  if (!entityModel) {
    return null;
  }

  return (
    <CourseFormComponent
      entityModel={entityModel}
      isEditing={isEditing}
      services={services}
    />
  );
};

export default memo(CourseForm);
