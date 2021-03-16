import { Roles, CourseLayoutModel } from '@dirtleague/common';
import express, { Router } from 'express';
import RepositoryServices from '../data-access/repository-services';
import corsHandler from '../http/cors-handler';
import { requireRoles } from '../auth/handler';
import withTryCatch from '../http/withTryCatch';
import { DbCourseLayout } from '../data-access/repositories/course-layouts';

const buildRoute = (services: RepositoryServices): Router => {
  const router = express.Router();

  router.get(
    '/',
    corsHandler,
    withTryCatch(async (req, res) => {
      const entities = await services.courseLayouts.getAll();

      res.json(entities);
    })
  );

  router.get(
    '/:id',
    corsHandler,
    withTryCatch(async (req, res) => {
      const { id } = req.params;
      const entity = await services.courseLayouts.get(parseInt(id, 10));

      res.json(entity);
    })
  );

  router.post(
    '/',
    corsHandler,
    requireRoles([Roles.Admin]),
    withTryCatch(async (req, res) => {
      const entity = new CourseLayoutModel(req.body);
      const newId = await services.courseLayouts.create(entity);

      entity.id = newId;

      res.json(entity.toJson());
    })
  );

  router.delete(
    '/:id',
    corsHandler,
    requireRoles([Roles.Admin]),
    withTryCatch(async (req, res) => {
      const { id } = req.params;

      await services.courseLayouts.delete(parseInt(id, 10));

      res.json({ success: true });
    })
  );

  router.patch(
    '/:id',
    corsHandler,
    requireRoles([Roles.Admin]),
    withTryCatch(async (req, res) => {
      const body = req.body as DbCourseLayout;

      await services.courseLayouts.update(body);

      res.json(null);
    })
  );

  return router;
};

export default buildRoute;
