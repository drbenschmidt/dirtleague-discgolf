import { ReactElement, memo } from 'react';
import { useParams } from 'react-router-dom';

const EventDetails = (): ReactElement => {
  const { id } = useParams<any>();

  return <h1>Event ID {id}</h1>;
};

export default memo(EventDetails);
