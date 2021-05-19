import { EventModel } from '@dirtleague/common';
import { ReactElement, memo, useEffect, useState } from 'react';
import { Message } from 'semantic-ui-react';
import { useParams } from 'react-router-dom';
import { useRepositoryServices } from '../../../data-access/context';
import { EntityDetailsParams } from '../../types';
import TabCollection from '../../../components/forms/tab-collection';
import RoundDetails from './round-details';
import Breadcrumbs from '../../../components/generic/breadcrumbs';
import { Events } from '../../../links';

const EventDetails = (): ReactElement | null => {
  const { id } = useParams<EntityDetailsParams>();
  const services = useRepositoryServices();
  const [result, setResult] = useState<EventModel>();

  useEffect(() => {
    const doWork = async () => {
      const event = await services?.events.get(parseInt(id, 10), {
        include: ['details'],
      });

      setResult(event);
    };

    doWork();
  }, [id, services?.events]);

  if (!result) {
    return null;
  }

  const { name } = result;

  return (
    <>
      <Breadcrumbs path={[Events.List, [Events.Details, { id, name }]]} />
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
