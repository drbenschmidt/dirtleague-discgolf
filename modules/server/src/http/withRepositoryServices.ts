import { NextFunction, Response } from 'express';
import RepositoryServices from '../data-access/repository-services';
import { DirtLeagueRequest } from '../auth/handler';
import EntityContext from '../data-access/entity-context';

const withRepositoryServices = (
  req: DirtLeagueRequest,
  res: Response,
  next: NextFunction
): void => {
  const entityContext = EntityContext.CreateFromPool();
  const services = new RepositoryServices(req.user, entityContext);

  req.services = services;
  req.entityContext = entityContext;

  next();
};

export default withRepositoryServices;
