import { ReactElement } from 'react';
import { useParams } from 'react-router-dom';

export const EventList = (): ReactElement => {
  return <h1>Events</h1>;
};

export const EventDetails = (): ReactElement => {
  const { id } = useParams<any>();

  return <h1>Event ID {id}</h1>;
};
