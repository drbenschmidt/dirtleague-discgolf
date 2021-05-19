import { asyncForEach, Role, CourseModel } from '@dirtleague/common';
import express, { Router } from 'express';
import withTryCatch from '../http/withTryCatch';
import { requireRoles } from '../auth/handler';
import withRepositoryServices from '../http/withRepositoryServices';
import toJson from '../utils/toJson';

const buildRoute = (): Router => {
  const router = express.Router();

  router.get(
    '/',
    withRepositoryServices,
    withTryCatch(async (req, res) => {
      const { services } = req;
      const users = await services.courses.getAll();

      res.json(users.map(toJson));
    })
  );

  router.get(
    '/:id',
    withRepositoryServices,
    withTryCatch(async (req, res) => {
      const { id } = req.params;
      const { include } = req.query;
      const { services } = req;
      const entity = await services.courses.get(parseInt(id, 10));

      if (!entity) {
        res.status(404).json({ error: 'Entity Not Found' });
      }

      // TODO: Move this logic to the repository when it's generalized.
      if (include && entity) {
        const courseLayouts = await services.courseLayouts.getAllForCourse(
          parseInt(id, 10)
        );

        await asyncForEach(courseLayouts, async courseLayout => {
          const holes = await services.courseHoles.getAllForCourseLayout(
            courseLayout.id
          );

          // eslint-disable-next-line no-param-reassign
          (courseLayout as any).attributes.holes = holes.map(toJson);
        });

        (entity as any).attributes.layouts = courseLayouts.map(toJson);
      }

      res.json(entity.toJson());
    })
  );

  router.get(
    '/:id/layouts',
    withRepositoryServices,
    withTryCatch(async (req, res) => {
      const { id } = req.params;
      const { services } = req;
      const entity = await services.courses.get(parseInt(id, 10));

      if (!entity) {
        res.status(404).json({ error: 'Entity Not Found' });
      }

      const courseLayouts = await services.courseLayouts.getAllForCourse(
        parseInt(id, 10)
      );

      res.json(courseLayouts.map(toJson));
    })
  );

  router.post(
    '/',
    requireRoles([Role.CourseManagement]),
    withRepositoryServices,
    withTryCatch(async (req, res) => {
      const { services } = req;
      const model = new CourseModel(req.body);

      await services.tx(async tx => {
        await tx.courses.insert(model);
      });

      res.json(model.toJson());
    })
  );

  router.delete(
    '/:id',
    requireRoles([Role.CourseManagement]),
    withRepositoryServices,
    withTryCatch(async (req, res) => {
      const { id } = req.params;
      const { services } = req;
      const entityId = parseInt(id, 10);

      await services.courses.delete(entityId);

      res.json({ success: true });
    })
  );

  router.put(
    '/:id',
    requireRoles([Role.CourseManagement]),
    withRepositoryServices,
    withTryCatch(async (req, res) => {
      const { services } = req;
      const model = new CourseModel(req.body);

      await services.tx(async tx => {
        await tx.courses.update(model);
      });

      res.json(null);
    })
  );

  return router;
};

export default buildRoute;
