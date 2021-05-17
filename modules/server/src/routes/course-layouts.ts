import { Roles, CourseLayoutModel } from '@dirtleague/common';
import express, { Router } from 'express';
import { requireRoles } from '../auth/handler';
import withTryCatch from '../http/withTryCatch';
import { DbCourseLayout } from '../data-access/entity-context/course-layouts';
import withRepositoryServices from '../http/withRepositoryServices';
import toJson from '../utils/toJson';

const buildRoute = (): Router => {
  const router = express.Router();

  router.get(
    '/',
    withRepositoryServices,
    withTryCatch(async (req, res) => {
      const { services } = req;
      const entities = await services.courseLayouts.getAll();

      res.json(entities.map(toJson));
    })
  );

  router.get(
    '/:id',
    withRepositoryServices,
    withTryCatch(async (req, res) => {
      const { services } = req;
      const { id } = req.params;
      const entity = await services.courseLayouts.get(parseInt(id, 10));

      res.json(entity.toJson());
    })
  );

  router.post(
    '/',
    requireRoles([Roles.Admin]),
    withRepositoryServices,
    withTryCatch(async (req, res) => {
      const { services } = req;
      const entity = new CourseLayoutModel(req.body);

      await services.courseLayouts.insert(entity);

      res.json(entity.toJson());
    })
  );

  router.delete(
    '/:id',
    requireRoles([Roles.Admin]),
    withRepositoryServices,
    withTryCatch(async (req, res) => {
      const { services } = req;
      const { id } = req.params;

      await services.courseLayouts.delete(parseInt(id, 10));

      res.json({ success: true });
    })
  );

  router.patch(
    '/:id',
    requireRoles([Roles.Admin]),
    withRepositoryServices,
    withTryCatch(async (req, res) => {
      const { services } = req;
      const body = new CourseLayoutModel(req.body);

      await services.courseLayouts.update(body);

      res.json(null);
    })
  );

  return router;
};

export default buildRoute;
