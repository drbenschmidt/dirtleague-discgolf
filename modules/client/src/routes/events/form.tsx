/* eslint-disable jsx-a11y/label-has-associated-control */
import React, {
  ReactElement,
  useCallback,
  useEffect,
  useState,
  useRef,
  memo,
} from 'react';
import {
  isNil,
  EventModel,
  RoundModel,
  SeasonModel,
  CourseModel,
  CourseLayoutModel,
  CardModel,
  PlayerModel,
  PlayerGroupModel,
  PlayerGroupPlayerModel,
} from '@dirtleague/common';
import { useParams, useHistory } from 'react-router-dom';
import {
  Form,
  TextArea,
  Segment,
  Header,
  Icon,
  Button,
} from 'semantic-ui-react';
import { LinkedList } from 'linked-list-typescript';
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
import Collection from '../../components/forms/collection';
import RepositoryServices from '../../data-access/repository-services';
import useSubscription from '../../hooks/useSubscription';

export interface RoundFormComponentProps {
  model: RoundModel;
}

export interface CardFormComponentProps {
  model: CardModel;
}

export interface PlayerGroupFormRowComponentProps {
  model: PlayerGroupModel;
}

export interface PlayerFormRowComponentProps {
  model: PlayerGroupPlayerModel;
}

const PlayerFormRow = (props: PlayerFormRowComponentProps): ReactElement => {
  const { model } = props;
  const modelRef = useRef(model);
  const services = useRepositoryServices();
  const playerBinding = useSelectBinding(modelRef, 'playerId');

  const playerSearch = useCallback(
    async (query: string) => {
      const players = await services?.players.getAll();
      const mapper = (course: PlayerModel) => ({
        text: course.fullName,
        value: course.id,
      });

      if (!players) {
        return [];
      }

      if (query.length === 0) {
        return players.map(mapper);
      }

      return players
        ?.filter(player =>
          player.fullName
            .toLocaleLowerCase()
            .includes(query.toLocaleLowerCase())
        )
        .map(mapper);
    },
    [services?.players]
  );

  return <EntitySearch {...playerBinding} searcher={playerSearch} />;
};

const PlayerGroupFormRow = (
  props: PlayerGroupFormRowComponentProps
): ReactElement => {
  const { model } = props;
  const modelRef = useRef(model);
  const teamNameBinding = useInputBinding(modelRef, 'teamName');

  return (
    <>
      <Form.Group widths="equal">
        <TextInput {...teamNameBinding} label="Team Name (optional)" />
      </Form.Group>
      <Collection
        tableColor="green"
        buttonText="Add Player"
        list={model.players}
        label="Players"
        RowComponent={PlayerFormRow}
        modelFactory={() => new PlayerGroupPlayerModel()}
      />
    </>
  );
};

const CardForm = (props: CardFormComponentProps): ReactElement => {
  const { model } = props;

  return (
    <Collection
      tableColor="blue"
      buttonText="Add Player Group"
      label="Card"
      list={model.playerGroups}
      RowComponent={PlayerGroupFormRow}
      modelFactory={() => new PlayerGroupModel()}
    />
  );
};

export interface CardListComponentProps {
  model: LinkedList<CardModel>;
}

const CardList = (props: CardListComponentProps): ReactElement => {
  const { model } = props;
  const [, setDummy] = useState(false);

  const addButton = useCallback(() => {
    model.append(new CardModel());
    setDummy(d => !d);
  }, [model]);

  if (model.length === 0) {
    return (
      <Segment placeholder>
        <Header icon>
          <Icon name="id card outline" />
          No Cards have been added for this round.
        </Header>
        <Button primary as="a" onClick={addButton}>
          Add Card
        </Button>
      </Segment>
    );
  }

  return (
    <>
      <Segment>
        {model.toArray().map(card => (
          <CardForm model={card} />
        ))}
        <Button primary as="a" onClick={addButton}>
          Add Card
        </Button>
      </Segment>
    </>
  );
};

const RoundForm = (props: RoundFormComponentProps): ReactElement => {
  const { model } = props;
  const modelRef = useRef(model);
  const layoutBinding = useSelectBinding(modelRef, 'courseLayoutId');
  const courseBinding = useSelectBinding(modelRef, 'courseId');
  const services = useRepositoryServices();
  const [courseId, setCourseId] = useState(modelRef.current.courseId);
  useSubscription(modelRef.current, 'courseId', setCourseId);

  // TODO: Gross.
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

  // TODO: Same as above, baby just pooped so I don't have time.
  const courseLayoutSearch = useCallback(
    async (query: string) => {
      if (isNil(courseId)) {
        return [];
      }

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
          {...courseBinding}
          label="Course"
          searcher={courseSearch}
        />
        <EntitySearch
          {...layoutBinding}
          label="Course Layout"
          searcher={courseLayoutSearch}
          disabled={isNil(courseId)}
        />
      </Form.Group>
      <CardList model={model.cards} />
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

  const modelFactory = useCallback(() => {
    const length = model.current?.rounds.length || 0;

    return new RoundModel({
      name: `Round ${length + 1}`,
    });
  }, [model]);

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

  if (!isEditing && !entityModel) {
    return <div>loading</div>;
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
