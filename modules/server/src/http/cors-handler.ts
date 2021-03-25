import cors from 'cors';

// TODO: Make origins configurable.
const corsHandler = cors({
  origin: [
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    'http://localhost:8080',
    'http://localhost:8081',
    'http://172.13.51.107',
    'http://172.13.51.107:8080',
    'http://dev.dirtleague.org',
    'http://dev.dirtleague.org:8080',
  ],
  credentials: true,
});

export default corsHandler;
