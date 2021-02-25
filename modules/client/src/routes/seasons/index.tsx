import { useParams } from 'react-router-dom';

export const SeasonList = () => {
  return <h1>Seasons</h1>;
};

export const SeasonDetails = () => {
  const { id } = useParams<any>();

  return <h1>Season ID {id}</h1>; 
};
