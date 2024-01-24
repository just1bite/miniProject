import { Router } from 'express';
import authRouter from '../modules/auth/router/auth.router';
import eventRouter from '../modules/event/router/event.router';

const apiRouter = Router();

apiRouter.use('/auth', authRouter);
apiRouter.use('/event', eventRouter);

export default apiRouter;
