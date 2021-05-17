import { Roles, CourseLayoutModel } from '@dirtleague/common';
import express, { Router } from 'express';
import EntityContext from '../data-access/entity-context';
import { requireRoles } from '../auth/handler';
import withTryCatch from '../http/withTryCatch';
import { DbCourseLayout } from '../data-access/entity-context/course-layouts';

const buildRoute = (services: EntityContext): Router => {
  const router = express.Router();

  router.get(
    '/',
    withTryCatch(async (req, res) => {
      const entities = await services.courseLayouts.getAll();

      res.json(entities);
    })
  );

  router.get(
    '/:id',
    withTryCatch(async (req, res) => {
      const { id } = req.params;
      const entity = await services.courseLayouts.get(parseInt(id, 10));

      res.json(entity);
    })
  );

  router.post(
    '/',
    requireRoles([Roles.Admin]),
    withTryCatch(async (req, res) => {
      const entity = new CourseLayoutModel(req.body);
      const newId = await services.courseLayouts.insert(entity);

      entity.id = newId;

      res.json(entity.toJson());
    })
  );

  router.delete(
    '/:id',
    requireRoles([Roles.Admin]),
    withTryCatch(async (req, res) => {
      const { id } = req.params;

      await services.courseLayouts.delete(parseInt(id, 10));

      res.json({ success: true });
    })
  );

  router.patch(
    '/:id',
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
