/* eslint-disable jsx-a11y/label-has-associated-control */
import { ReactElement, useCallback, useEffect, useState, memo } from 'react';
import { isNil, EventModel, RoundModel, SeasonModel } from '@dirtleague/common';
import { useParams, useHistory } from 'react-router-dom';
import { Form, TextArea } from 'semantic-ui-react';
import TextInput from '../../../components/forms/text-input';
import { useRepositoryServices } from '../../../data-access/context';
import {
  useDateBinding,
  useInputBinding,
  useTransaction,
  useSelectBinding,
} from '../../../hooks/forms';
import { EntityDetailsParams } from '../../types';
import DatePicker from '../../../components/forms/date-picker';
import TabCollection from '../../../components/forms/tab-collection';
import EntitySearch from '../../../components/forms/entity-search';
import RepositoryServices from '../../../data-access/repository-services';
import RoundForm from './round-form';
import FocusOnMount from '../../../components/generic/focus-on-mount';
import Breadcrumbs, {
  BreadcrumbPart,
} from '../../../components/generic/breadcrumbs';
import { Events } from '../../../links';
import useModelValidation from '../../../hooks/useModelValidation';

export interface EventFormComponentProps {
  entityModel: EventModel;
  isEditing: boolean;
  services: RepositoryServices | null;
}

const EventFormComponent = (
  props: EventFormComponentProps
): ReactElement | null => {
  const { entityModel, isEditing } = props;
  const services = useRepositoryServices();
  const { model } = useTransaction<EventModel>(entityModel);
  const nameBinding = useInputBinding(model, 'name');
  const descriptionBinding = useInputBinding(model, 'description');
  const startDateBinding = useDateBinding(model, 'startDate');
  const seasonBinding = useSelectBinding(model, 'seasonId');
  const [isInFlight, setIsInFlight] = useState(false);
  const history = useHistory();
  const isValid = useModelValidation(model);

  const onFormSubmit = useCallback(() => {
    const submit = async () => {
      if (model.current) {
        if (!(await isValid())) {
          return;
        }

        try {
          setIsInFlight(true);
          if (isEditing) {
            await services?.events.update(model.current);

            history.push(`/events/${model.current.id}`);
          } else {
            const response = await services?.events.create(model.current);

            history.push(`/events/${response?.id}`);
          }
        } finally {
          setIsInFlight(false);
        }
      }
    };

    submit();
  }, [model, isValid, isEditing, services?.events, history]);

  // TODO: This is a terrible design but I don't have time to make
  // this work correctly right now.
  const seasonSearch = useCallback(
    async (query: string) => {
      const seasons = await services?.seasons.getAll();
      const mapper = (season: SeasonModel) => ({
        text: season.name,
        value: season.id,
      });

      if (!seasons) {
        return [];
      }

      if (query.length === 0) {
        return seasons.map(mapper);
      }

      return seasons
        ?.filter(season =>
          season.name.toLocaleLowerCase().startsWith(query.toLocaleLowerCase())
        )
        .map(mapper);
    },
    [services?.seasons]
  );

  const modelFactory = useCallback(() => {
    const length = model.current?.rounds.length || 0;

    return new RoundModel({
      name: `Round ${length + 1}`,
    });
  }, [model]);

  const title = isEditing ? 'Edit Event' : 'New Event';
  const pathPart = isEditing
    ? ([
        Events.Edit,
        { name: model.current?.name, id: model.current?.id },
      ] as BreadcrumbPart)
    : Events.New;

  return (
    <>
      <Breadcrumbs path={[Events.List, pathPart]} />
      <h1>{title}</h1>
      <Form onSubmit={onFormSubmit} loading={isInFlight}>
        <Form.Group widths="equal">
          <FocusOnMount>
            {ref => (
              <TextInput
                {...nameBinding}
                ref={ref}
                fluid
                label="Name"
                placeholder="Event Name"
              />
            )}
          </FocusOnMount>
          <DatePicker {...startDateBinding} label="Event Date" />
          <EntitySearch
            {...seasonBinding}
            label="Season"
            searcher={seasonSearch}
          />
        </Form.Group>
        <TextInput
          {...descriptionBinding}
          fluid
          label="Description"
          placeholder="Event Description"
          control={TextArea}
        />
        <TabCollection
          mode="form"
          label="Rounds"
          TabComponent={RoundForm}
          list={model.current?.rounds}
          modelFactory={modelFactory}
        />
        <Form.Button positive content="Submit" />
      </Form>
    </>
  );
};

const EventForm = (): ReactElement | null => {
  const { id } = useParams<EntityDetailsParams>();
  const isEditing = !isNil(id);
  const services = useRepositoryServices();
  const [entityModel, setEntityModel] = useState<EventModel>();

  // Get the entity from the server if we're editing it.
  useEffect(() => {
    if (isEditing) {
      const getEntity = async () => {
        const response = await services?.events.get(parseInt(id, 10), {
          include: ['details'],
        });

        if (response) {
          setEntityModel(response);
        }
      };

      getEntity();
    } else {
      const response = new EventModel({
        rounds: [
          {
            name: 'Round 1',
          },
        ],
      });

      setEntityModel(response);
    }
  }, [id, isEditing, services?.events]);

  if (!isEditing && !entityModel) {
    return <div>Loading...</div>;
  }

  if (!entityModel) {
    return null;
  }

  return (
    <EventFormComponent
      entityModel={entityModel}
      isEditing={isEditing}
      services={services}
    />
  );
};

export default memo(EventForm);
