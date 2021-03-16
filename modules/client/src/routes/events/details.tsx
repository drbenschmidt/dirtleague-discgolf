import { CardModel, EventModel, RoundModel } from '@dirtleague/common';
import { ReactElement, memo, useEffect, useState } from 'react';
import { Message } from 'semantic-ui-react';
import { useParams } from 'react-router-dom';
import { useRepositoryServices } from '../../data-access/context';
import { EntityDetailsParams } from '../types';
import TabCollection from '../../components/forms/tab-collection';

interface CardDetailsProps {
  model: CardModel;
}

const CardDetails = (props: CardDetailsProps): ReactElement => {
  const { model } = props;

  return <h1>{model.id}</h1>;
};

interface RoundDetailsProps {
  model: RoundModel;
}

const RoundDetails = (props: RoundDetailsProps): ReactElement => {
  const { model } = props;

  return (
    <>
      <div>Course: {model.course?.name}</div>
      <div>Layout: {model.courseLayout?.name}</div>
      <div>
        {model.cards.toArray().map(card => (
          <CardDetails model={card} />
        ))}
      </div>
    </>
  );
};

const EventDetails = (): ReactElement | null => {
  const { id } = useParams<EntityDetailsParams>();
  const services = useRepositoryServices();
  const [result, setResult] = useState<EventModel>();

  useEffect(() => {
    const doWork = async () => {
      const event = await services?.events.get(parseInt(id, 10), {
        include: ['rounds'],
      });

      setResult(event);
    };

    doWork();
  }, [id, services?.events]);

  if (!result) {
    return null;
  }

  return (
    <>
      <h1>{result.name}</h1>
      <Message>
        <Message.Header>Description</Message.Header>
        <p>{result.description}</p>
      </Message>
      <TabCollection
        mode="details"
        TabComponent={RoundDetails}
        list={result?.rounds}
      />
    </>
  );
};

export default memo(EventDetails);
