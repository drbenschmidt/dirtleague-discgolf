import { Request, Response, NextFunction } from 'express';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
const genericErrorHandler = (
  err: Error,
  req: Request,
  res: Response,
  // eslint-disable-next-line no-unused-vars
  _next: NextFunction
) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
};

export default genericErrorHandler;
