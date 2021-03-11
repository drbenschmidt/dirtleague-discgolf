import {
  ReactElement,
  useCallback,
  useEffect,
  useState,
  useRef,
  memo,
} from 'react';
import {
  isNil,
  CourseModel,
  CourseLayoutModel,
  CourseHoleModel,
} from '@dirtleague/common';
import { useParams, useHistory } from 'react-router-dom';
import { Form, Tab, Button, Menu, Grid, Table } from 'semantic-ui-react';
import TextInput from '../../components/forms/text-input';
import SelectInput from '../../components/forms/select-input';
import { useRepositoryServices } from '../../data-access/context';
import { useInputBinding, useTransaction } from '../../hooks/forms';
import { EntityDetailsParams } from '../types';

const Styles = {
  header: { width: '75px' },
};

const TableCellInput = (props: {
  model: CourseHoleModel;
  name: string;
}): ReactElement => {
  const { model, name } = props;
  const modelRef = useRef(model);
  const bindings = useInputBinding(modelRef, name);

  return (
    <Table.HeaderCell>
      <TextInput
        {...bindings}
        type="number"
        size="mini"
        style={Styles.header}
      />
    </Table.HeaderCell>
  );
};

const CourseLengthOptions = [
  { text: '9', value: 9 },
  { text: '18', value: 18 },
  { text: '27', value: 27 },
];

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
        <Table definition style={{ marginLeft: '5px', marginRight: '5px' }}>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell style={Styles.header} key="blank" />
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
                <TableCellInput key={hole.cid} model={hole} name="distance" />
              ))}
            </Table.Row>
            <Table.Row>
              <Table.Cell>Par</Table.Cell>
              {holesArray.map(hole => (
                <TableCellInput key={hole.cid} model={hole} name="par" />
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
      key="add_layout"
      as="a"
      positive
      style={{ marginLeft: '5px', lineHeight: 'inherit', marginBottom: '5px' }}
      onClick={() => {
        model.current?.layouts.append(CourseLayoutModel.createDefault());
        const newSize = model.current?.layouts.length || 1;
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
    model.current?.layouts.toArray().map(layout => {
      return {
        menuItem: (
          <Menu.Item onClick={onMenuClick} key={`menu_${layout.cid}`}>
            {layout.name}
          </Menu.Item>
        ),
        render: () => (
          <Tab.Pane>
            <CourseLayoutForm key={layout.cid} model={layout} />
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
