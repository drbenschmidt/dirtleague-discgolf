import morgan, { StreamOptions } from 'morgan';
import { getLogger } from './logger';

const stream: StreamOptions = {
  // Use the http severity
  write: message => getLogger().http(message),
};

const skip = () => {
  const env = process.env.NODE_ENV || 'development';
  return env !== 'development';
};

const morganMiddleware = morgan(
  ':method :url :status :res[content-length] - :response-time ms',
  { stream, skip }
);

export default morganMiddleware;
