import { NextFunction, Response, Request } from 'express';

const withTryCatch = (
  callback: (req: Request, res: Response, next: NextFunction) => void
) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await callback(req, res, next);
    } catch (e) {
      // TODO: Only return errors in dev mode.
      console.error(e.message, e);
      res.status(500).json({ success: false, error: e });
    }
  };
};

export default withTryCatch;
