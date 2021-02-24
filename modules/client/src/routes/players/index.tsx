import { Link, useRouteMatch, useParams } from 'react-router-dom';

const Players = () => {
  const { path, url } = useRouteMatch();

  return (
    <>
      <h1>Players</h1>
      <ul>
        <li>
          <Link to={`${url}/1`}>Ben</Link>
        </li>
        <li>
          <Link to={`${url}/2`}>Tim</Link>
        </li>
        <li>
          <Link to={`${url}/3`}>Kyle</Link>
        </li>
      </ul>
    </>
  );
};

export const PlayerDetails = () => {
  const { id } = useParams<any>();

  return <h1>Player ID {id}</h1>;
};

export default Players;
