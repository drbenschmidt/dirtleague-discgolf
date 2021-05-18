/* eslint-disable no-param-reassign */
import {
  asyncForEach,
  Roles,
  EventModel,
  RoundModel,
} from '@dirtleague/common';
import type { ParsedQs } from 'qs';
import multer from 'multer';
import express, { Router } from 'express';
import withTryCatch from '../http/withTryCatch';
import { requireRoles } from '../auth/handler';
import EntityContext from '../data-access/entity-context';
import { DbRound } from '../data-access/entity-context/rounds';
import { DbCard } from '../data-access/entity-context/cards';
import { DbPlayerGroup } from '../data-access/entity-context/player-groups';
import { DbPlayerGroupPlayer } from '../data-access/entity-context/player-group-players';
import getCrud from '../utils/getCrud';
import parseUDisc from '../utils/parseUdisc';
import withRepositoryServices from '../http/withRepositoryServices';
import toJson from '../utils/toJson';

const includesMap = {
  details: [
    'event.rounds',
    'round.course',
    'round.courseLayout',
    'round.courseLayout.holes',
    'round.cards',
    'round.card.playerGroups',
    'round.card.playerGroup.playerGroupPlayers',
    'round.card.playerGroup.playerGroupPlayer.profile',
    'round.card.playerGroup.playerGroupPlayer.ratings',
    'round.card.playerGroup.playerGroupResults',
  ],
};

const getInclude = (
  query: ParsedQs,
  map: Record<string, string[]>,
  defaultValue: string
) => {
  const { include } = query;

  if (!include) {
    return map[defaultValue];
  }

  const includes = (include as string).split(',');

  if (includes.length === 1 && map[includes[0]] !== undefined) {
    return map[includes[0]];
  }

  return includes;
};

const buildRoute = (): Router => {
  const router = express.Router();

  const storage = multer.memoryStorage();
  const csvUpload = multer({ storage });

  router.get(
    '/',
    withRepositoryServices,
    withTryCatch(async (req, res) => {
      const { services } = req;
      const entities = await services.events.getAll();

      res.json(entities.map(toJson));
    })
  );

  router.get(
    '/:id',
    withRepositoryServices,
    withTryCatch(async (req, res) => {
      const { services } = req;
      const { id } = req.params;
      const include = getInclude(req.query, includesMap, 'details');
      const entity = await services.events.get(parseInt(id, 10), include);

      if (!entity) {
        res.status(404).json({ error: 'Entity Not Found' });
      }

      res.json(entity.toJson());
    })
  );

  router.post(
    '/',
    requireRoles([Roles.Admin]),
    withRepositoryServices,
    withTryCatch(async (req, res) => {
      const { services } = req;
      const model = new EventModel(req.body);

      await services.tx(async tx => {
        await tx.events.insert(model);
      });

      res.json(model.toJson());
    })
  );

  router.put(
    '/:id/card/:cardId/upload',
    requireRoles([Roles.Admin]),
    csvUpload.single('csv'),
    withRepositoryServices,
    withTryCatch(async (req, res) => {
      const { services } = req;
      const { cardId } = req.params;
      const csvData = req.file.buffer.toString('utf8');
      const scores = parseUDisc(csvData);

      await services.tx(async tx => {
        await tx.cards.applyScoreCard(parseInt(cardId, 10), scores);
      });

      res.json({ success: true, scores });
    })
  );

  router.delete(
    '/:id',
    requireRoles([Roles.Admin]),
    withRepositoryServices,
    withTryCatch(async (req, res) => {
      const { services } = req;
      const { id } = req.params;
      const entityId = parseInt(id, 10);

      await services.events.delete(entityId);

      res.json({ success: true });
    })
  );

  router.patch(
    '/:id',
    requireRoles([Roles.Admin]),
    withRepositoryServices,
    withTryCatch(async (req, res) => {
      const { services } = req;
      const model = new EventModel(req.body);

      await services.tx(async tx => {
        await tx.events.update(model);
      });

      res.json(null);
    })
  );

  return router;
};

export default buildRoute;
