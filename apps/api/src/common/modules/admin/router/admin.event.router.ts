import authenticationMiddleware from '@/common/middleware/authentication.middleware';
import authorizationMiddleware from '@/common/middleware/authorization.middleware';
import { Router } from 'express';
import { getEvent } from '../handler/admin.handler.router';

const adminEventRoutes = Router();

adminEventRoutes.get(
  '/events',
  authenticationMiddleware,
  authorizationMiddleware,
  getEvent,
);

export default adminEventRoutes;
