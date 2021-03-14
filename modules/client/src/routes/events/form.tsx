import {
  ReactElement,
  useCallback,
  useEffect,
  useState,
  useRef,
  memo,
  useMemo,
} from 'react';
import {
  isNil,
  EventModel,
  RoundModel,
  SeasonModel,
  CourseModel,
  CourseLayoutModel,
} from '@dirtleague/common';
import { useParams, useHistory } from 'react-router-dom';
import { Form, TextArea } from 'semantic-ui-react';
import TextInput from '../../components/forms/text-input';
import { useRepositoryServices } from '../../data-access/context';
import {
  useDateBinding,
  useInputBinding,
  useTransaction,
  useSelectBinding,
} from '../../hooks/forms';
import { EntityDetailsParams } from '../types';
import DatePicker from '../../components/forms/date-picker';
import TabCollection from '../../components/forms/tab-collection';
import EntitySearch from '../../components/forms/entity-search';
import RepositoryServices from '../../data-access/repository-services';

export interface RoundFormComponentProps {
  model: RoundModel;
  courseId: number;
}

const RoundForm = (props: RoundFormComponentProps): ReactElement => {
  const { model, courseId } = props;
  const modelRef = useRef(model);
  const layoutBinding = useSelectBinding(modelRef, 'courseLayoutId');
  const services = useRepositoryServices();

  // TODO: Same as above, baby just pooped so I don't have time.
  const courseLayoutSearch = useCallback(
    async (query: string) => {
      const courseLayouts = await services?.courses.getLayoutsForCourse(
        courseId
      );
      const mapper = (course: CourseLayoutModel) => ({
        text: course.name,
        value: course.id,
      });

      if (!courseLayouts) {
        return [];
      }

      if (query.length === 0) {
        return courseLayouts.map(mapper);
      }

      return courseLayouts
        ?.filter(layout =>
          layout.name.toLocaleLowerCase().startsWith(query.toLocaleLowerCase())
        )
        .map(mapper);
    },
    [courseId, services?.courses]
  );

  return (
    <>
      <Form.Group widths="equal">
        <EntitySearch
          {...layoutBinding}
          label="Course Layout"
          searcher={courseLayoutSearch}
        />
      </Form.Group>
    </>
  );
};

export interface EventFormComponentProps {
  entityModel: EventModel;
  isEditing: boolean;
  services: RepositoryServices | null;
}

const EventFormComponent = (
  props: EventFormComponentProps
): ReactElement | null => {
  const { entityModel, isEditing, services } = props;
  const { model } = useTransaction<EventModel>(entityModel);
  const nameBinding = useInputBinding(model, 'name');
  const descriptionBinding = useInputBinding(model, 'description');
  const startDateBinding = useDateBinding(model, 'startDate');
  const seasonBinding = useSelectBinding(model, 'seasonId');
  const courseBinding = useSelectBinding(model, 'courseId');
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

  // TODO: Same as above, baby just pooped so I don't have time.
  const courseSearch = useCallback(
    async (query: string) => {
      const courses = await services?.courses.getAll();
      const mapper = (course: CourseModel) => ({
        text: course.name,
        value: course.id,
      });

      if (!courses) {
        return [];
      }

      if (query.length === 0) {
        return courses.map(mapper);
      }

      return courses
        ?.filter(course =>
          course.name.toLocaleLowerCase().startsWith(query.toLocaleLowerCase())
        )
        .map(mapper);
    },
    [services?.courses]
  );

  // TODO: Move courseId to round as we can have rounds at different courses (such as a Madison day of discing.)
  // Right now there's an issue because Round form is decoupled from Event form by the generic tab collection.
  // If we pass in props, we have to rerender the whole collection if that changes.
  // Instead of building a way to access all the models through the react component tree (context) I just should
  // move the prop anyway.
  const tabProps = {
    courseId: model.current?.courseId,
  };

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
          <EntitySearch
            {...seasonBinding}
            label="Season"
            searcher={seasonSearch}
          />
        </Form.Group>
        <EntitySearch
          {...courseBinding}
          label="Course"
          searcher={courseSearch}
        />
        <TextInput
          {...descriptionBinding}
          fluid
          label="Description"
          placeholder="Event Description"
          control={TextArea}
        />
        <TabCollection
          label="Rounds"
          TabComponent={RoundForm}
          list={model.current?.rounds}
          modelFactory={() => new RoundModel()}
          tabProps={tabProps}
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
    <EventFormComponent
      entityModel={entityModel}
      isEditing={isEditing}
      services={services}
    />
  );
};

export default memo(EventForm);
