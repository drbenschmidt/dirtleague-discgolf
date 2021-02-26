import { ReactElement } from 'react';
import { useParams } from 'react-router-dom';

export const SeasonList = (): ReactElement => {
  return <h1>Seasons</h1>;
};

export const SeasonDetails = (): ReactElement => {
  const { id } = useParams<any>();

  return <h1>Season ID {id}</h1>;
};
