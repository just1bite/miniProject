import { Router } from 'express';
import {
  applyReferralDiscount,
  createEvent,
  createTransaction,
  // createTicketType,
  deleteEventById,
  eventPayload,
  getEvent,
  getEventById,
  patchEventById,
  // redeemPoints,
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

eventRouter.get('/', getEvent);
eventRouter.get('/:id', authorizationMiddleware, getEventById);
eventRouter.patch('/update/:id', authorizationMiddleware, patchEventById);
eventRouter.delete('/delete/:id', authorizationMiddleware, deleteEventById);
// eventRouter.post('/:eventid', authorizationMiddleware, createTicketType);
eventRouter.post('/:eventid/rating', addRatingAndReview);
eventRouter.post('/:eventid/referral', applyReferralDiscount);
eventRouter.post('/:eventid/transaction', createTransaction);

export default eventRouter;
