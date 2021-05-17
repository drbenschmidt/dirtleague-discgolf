import { asyncForEach, Roles, CourseModel } from '@dirtleague/common';
import express, { Router } from 'express';
import withTryCatch from '../http/withTryCatch';
import { requireRoles } from '../auth/handler';
import withRepositoryServices from '../http/withRepositoryServices';

const buildRoute = (): Router => {
  const router = express.Router();

  router.get(
    '/',
    withRepositoryServices,
    withTryCatch(async (req, res) => {
      const { services } = req;
      const users = await services.courses.getAll();

      res.json(users);
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

      // TODO: parse it and check for entity types.
      if (include && entity) {
        const courseLayouts = await services.courseLayouts.getAllForCourse(
          parseInt(id, 10)
        );

        (entity as any).layouts = courseLayouts;

        await asyncForEach(courseLayouts, async courseLayout => {
          const holes = await services.courseHoles.getAllForCourseLayout(
            courseLayout.id
          );

          // eslint-disable-next-line no-param-reassign
          (courseLayout as any).holes = holes;
        });
      }

      res.json(entity);
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

      res.json(courseLayouts);
    })
  );

  router.post(
    '/',
    requireRoles([Roles.Admin]),
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
    requireRoles([Roles.Admin]),
    withRepositoryServices,
    withTryCatch(async (req, res) => {
      const { id } = req.params;
      const { services } = req;
      const entityId = parseInt(id, 10);

      await services.courses.delete(entityId);

      res.json({ success: true });
    })
  );

  router.patch(
    '/:id',
    requireRoles([Roles.Admin]),
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
