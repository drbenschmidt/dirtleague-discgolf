import { NextFunction, Response, Request } from 'express';
import { DirtLeagueRequest } from '../auth/handler';

const withTryCatch = (
  callback: (req: DirtLeagueRequest, res: Response, next: NextFunction) => void
) => {
  return async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      await callback(req as DirtLeagueRequest, res, next);
    } catch (e) {
      // TODO: Only return errors in dev mode.
      console.error(e.message, e);
      res.status(500).json({ success: false, error: e });
    }
  };
};

export default withTryCatch;
