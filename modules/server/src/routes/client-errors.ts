import express, { Router } from 'express';
import withTryCatch from '../http/withTryCatch';
import { getClientLogger } from '../logging/logger';

export interface ClientErrorRequest {
  message: string;
  meta?: {
    stack?: string;
  };
}

const logger = getClientLogger();

const buildRoute = (): Router => {
  const router = express.Router();

  router.post(
    '/',
    withTryCatch(async (req, res) => {
      const entity = req.body as ClientErrorRequest;

      logger.error(entity.message, entity.meta);

      res.status(200).json({ success: true });
    })
  );

  return router;
};

export default buildRoute;
