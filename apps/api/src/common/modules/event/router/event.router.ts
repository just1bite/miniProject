import { Router } from 'express';
import {
  createEvent,
  createTicketTier,
  deleteEventById,
  eventPayload,
  getEvent,
  getEventById,
  patchEventById,
} from '../handler/event.handler';
import { inputValidator } from '@/common/helper/validator.helper';
import authorizationMiddleware from '@/common/middleware/authorization.middleware';
import { addRatingAndReview } from '../handler/review.handler';

const eventRouter = Router();

eventRouter.post(
  '/create',
  authorizationMiddleware,
  inputValidator(eventPayload),
  createEvent,
);

eventRouter.get('/', authorizationMiddleware, getEvent);
eventRouter.get('/:id', authorizationMiddleware, getEventById);
eventRouter.patch('/update/:id', authorizationMiddleware, patchEventById);
eventRouter.delete('/delete/:id', authorizationMiddleware, deleteEventById);
eventRouter.post('/:eventId', authorizationMiddleware, createTicketTier);
eventRouter.post('/:eventid/rating', addRatingAndReview);

export default eventRouter;
