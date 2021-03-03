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
  // TODO: Make sure not to send this down in production.
  res.status(500).json({ success: false, error: err });
};

export default genericErrorHandler;
