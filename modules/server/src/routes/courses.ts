import {
  isNil,
  PlayerModel,
  asyncForEach,
  Roles,
  intersect,
  except,
  getById,
  CourseModel,
} from '@dirtleague/common';
import express, { Router } from 'express';
import withTryCatch from '../http/withTryCatch';
import { requireRoles } from '../auth/handler';
import RepositoryServices from '../data-access/repository-services';
import corsHandler from '../http/cors-handler';
import { DbCourseLayout } from '../data-access/repositories/course-layouts';
import { DbCourseHole } from '../data-access/repositories/course-holes';

const buildRoute = (services: RepositoryServices): Router => {
  const router = express.Router();

  router.get(
    '/',
    corsHandler,
    withTryCatch(async (req, res) => {
      const users = await services.courses.getAll();

      res.json(users);
    })
  );

  router.get(
    '/:id',
    corsHandler,
    withTryCatch(async (req, res) => {
      const { id } = req.params;
      const { include } = req.query;
      const entity = await services.courses.get(parseInt(id, 10));

      console.log(include);

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

  router.post(
    '/',
    corsHandler,
    requireRoles([Roles.Admin]),
    withTryCatch(async (req, res) => {
      const model = new CourseModel(req.body);
      const newId = await services.courses.create(model);

      model.id = newId;

      if (model.layouts) {
        // Create each alias if included.
        await model.layouts.asyncForEach(async layout => {
          // Make sure the aliases relate to this player.
          // eslint-disable-next-line no-param-reassign
          layout.courseId = newId;

          const layoutJson = layout.toJson();

          const newLayoutId = await services.courseLayouts.create(
            layoutJson as DbCourseLayout
          );

          // eslint-disable-next-line no-param-reassign
          layout.id = newLayoutId;
          layoutJson.id = newLayoutId;

          await asyncForEach(layout.holes.toArray(), async hole => {
            // eslint-disable-next-line no-param-reassign
            hole.courseLayoutId = newLayoutId;

            const holeJson = hole.toJson();

            await services.courseHoles.create(holeJson as DbCourseHole);
          });
        });
      }

      res.json(model.toJson());
    })
  );

  router.delete(
    '/:id',
    corsHandler,
    requireRoles([Roles.Admin]),
    withTryCatch(async (req, res) => {
      const { id } = req.params;
      const entityId = parseInt(id, 10);

      await services.courses.delete(entityId);

      res.json({ success: true });
    })
  );

  router.patch(
    '/:id',
    corsHandler,
    requireRoles([Roles.Admin]),
    withTryCatch(async (req, res) => {
      // TODO: Technically, this should be a transaction.
      const body = req.body as CourseModel;

      await services.courses.update(body);

      if (body.layouts) {
        const requestLayouts = Array.from(body.layouts);
        const dbLayouts = await services.courseLayouts.getAllForCourse(body.id);
        const dbLayoutIds = dbLayouts.map(a => a.id);
        const requestLayoutIds = requestLayouts.map(a => a.id);
        const layoutsToCreate = requestLayouts.filter(a => isNil(a.id));
        const layoutsToUpdate = intersect(dbLayoutIds, requestLayoutIds);
        const layoutsToDelete = except(dbLayoutIds, requestLayoutIds);

        await asyncForEach(layoutsToCreate, async entity => {
          // eslint-disable-next-line no-param-reassign
          entity.courseId = body.id;
          const layoutJson = entity.toJson();

          const newLayoutId = await services.courseLayouts.create(
            layoutJson as DbCourseLayout
          );

          // eslint-disable-next-line no-param-reassign
          entity.id = newLayoutId;
          layoutJson.id = newLayoutId;

          await asyncForEach(entity.holes.toArray(), async hole => {
            // eslint-disable-next-line no-param-reassign
            hole.courseLayoutId = newLayoutId;

            const holeJson = hole.toJson();

            await services.courseHoles.create(holeJson as DbCourseHole);
          });
        });

        await asyncForEach(
          getById(requestLayouts, layoutsToUpdate),
          async entity => {
            await services.courseLayouts.update(entity);

            // TODO: Should we allow them to update the lengths/par?
            // That would affect old records.
            // Might have to archive them or have revisions. Ugh.
          }
        );

        await asyncForEach(
          getById(dbLayouts, layoutsToDelete),
          async entity => {
            await services.courseLayouts.delete(entity.id);
          }
        );
      }

      res.json(null);
    })
  );

  return router;
};

export default buildRoute;
