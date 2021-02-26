import { useParams } from 'react-router-dom';

export const EventList = () => {
  return <h1>Events</h1>;
};

export const EventDetails = () => {
  const { id } = useParams<any>();

  return <h1>Event ID {id}</h1>;
};
