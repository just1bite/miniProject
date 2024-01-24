import { Router } from 'express';
import {
  signOut,
  signUpSchema,
  signinUser,
  signupUser,
} from '../handler/auth.handler';
import { inputValidator } from '@/common/helper/validator.helper';

const authRouter = Router();

authRouter.post('/signin', signinUser);
authRouter.post('/signup', inputValidator(signUpSchema), signupUser);
authRouter.post('/signout', signOut);

export default authRouter;
