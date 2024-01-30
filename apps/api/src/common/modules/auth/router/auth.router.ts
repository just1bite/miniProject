import { Router } from 'express';
import {
  signOut,
  signUpSchema,
  signinUser,
  signupUser,
  getUserById,
} from '../handler/auth.handler';
import { inputValidator } from '@/common/helper/validator.helper';
import authAccountmiddleware from '@/common/middleware/authAccountmiddleware';

const authRouter = Router();

authRouter.post('/signin', signinUser);
authRouter.post('/signup', inputValidator(signUpSchema), signupUser);
authRouter.post('/signout', signOut);
authRouter.get('/profil');
authRouter.get('/:id', authAccountmiddleware, getUserById);

export default authRouter;
