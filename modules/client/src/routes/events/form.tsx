import {
  ReactElement,
  useCallback,
  useEffect,
  useState,
  useRef,
  memo,
} from 'react';
import { isNil, EventModel } from '@dirtleague/common';
import { useParams, useHistory } from 'react-router-dom';
import { Form, TextArea } from 'semantic-ui-react';
import TextInput from '../../components/forms/text-input';
import { useRepositoryServices } from '../../data-access/context';
import {
  useDateBinding,
  useInputBinding,
  useTransaction,
} from '../../hooks/forms';
import { EntityDetailsParams } from '../types';
import DatePicker from '../../components/forms/date-picker';
import TabCollection from '../../components/forms/tab-collection';

const RoundForm = (): ReactElement => {
  return <div>Round</div>;
};

const EntityFormComponent = (props: any): ReactElement | null => {
  const { entityModel, isEditing, services } = props;
  const { model } = useTransaction<EventModel>(entityModel);
  const nameBinding = useInputBinding(model, 'name');
  const descriptionBinding = useInputBinding(model, 'description');
  const startDateBinding = useDateBinding(model, 'startDate');
  const [isInFlight, setIsInFlight] = useState(false);
  const history = useHistory();

  const onFormSubmit = useCallback(() => {
    const submit = async () => {
      if (model.current) {
        try {
          setIsInFlight(true);
          if (isEditing) {
            await services?.events.update(model.current);

            history.push(`/events/${model.current.id}`);
          } else {
            await services?.events.create(model.current);

            // TODO: Move to course view?
            history.push('/events');
          }
        } finally {
          setIsInFlight(false);
        }
      }
    };

    submit();
  }, [isEditing, model, services?.events, history]);

  return (
    <>
      <h1>{isEditing ? 'Edit Event' : 'New Event'}</h1>
      <Form onSubmit={onFormSubmit} loading={isInFlight}>
        <Form.Group widths="equal">
          <TextInput
            {...nameBinding}
            fluid
            label="Name"
            placeholder="Event Name"
          />
          <DatePicker {...startDateBinding} label="Event Date" />
        </Form.Group>
        <TextInput
          {...descriptionBinding}
          fluid
          label="Description"
          placeholder="Event Description"
          control={TextArea}
        />
        <TabCollection
          TabComponent={RoundForm}
          list={model.current?.rounds}
          modelFactory={() => new EventModel()}
        />
        <Form.Button positive content="Submit" />
      </Form>
    </>
  );
};

const EntityForm = (): ReactElement | null => {
  const { id } = useParams<EntityDetailsParams>();
  const isEditing = !isNil(id);
  const services = useRepositoryServices();
  const [entityModel, setEntityModel] = useState<EventModel>();

  // Get the entity from the server if we're editing it.
  useEffect(() => {
    if (isEditing) {
      const getEntity = async () => {
        const response = await services?.events.get(parseInt(id, 10), {
          include: ['rounds'],
        });

        if (response) {
          setEntityModel(response);
        }
      };

      getEntity();
    } else {
      const response = new EventModel();

      setEntityModel(response);
    }
  }, [id, isEditing, services?.events]);

  if (!entityModel) {
    return null;
  }

  return (
    <EntityFormComponent
      entityModel={entityModel}
      isEditing={isEditing}
      services={services}
    />
  );
};

export default memo(EntityForm);
