import { ReactElement } from 'react';
import { Message } from 'semantic-ui-react';

const Home = (): ReactElement => {
  return (
    <Message>
      <Message.Header>Dirt League Alpha</Message.Header>
      <p>The state of this app is going to be in flux.</p>
      <p>
        The data saved in this app will not survive, it will be deleted whenever
        Ben needs to, so please dont expect your work to show up later.
      </p>
      <p>
        Please add all bugs and comments as{' '}
        <a
          rel="noreferrer"
          target="_blank"
          href="https://github.com/drbenschmidt/dirtleague-discgolf/issues"
        >
          GitHub Issues
        </a>{' '}
        with repro steps so I can fix them.
      </p>
    </Message>
  );
};

export default Home;
