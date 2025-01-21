import { Router } from 'express';
import { Middleware } from '../../middleware';
import { Validator } from '../../validate';
import { UserController } from './userController';
import { UserMiddleware } from './userMiddleware';

import { RefresrhTokenModel, SignInModel, SignUpModel } from './userModel';

const router: Router = Router();
const middleware = new Middleware();
const v: Validator = new Validator();
const userController = new UserController();
const userMiddleware = new UserMiddleware();

router.post(
  '/sign-in',
  v.validate(SignInModel),
  userMiddleware.checkCredentials,
  userController.signIn
);

router.post(
  '/sign-up',
  v.validate(SignUpModel),
  userMiddleware.checkUserExists,
  userController.signUp
);

router.post(
  '/refresh-token',
  v.validate(RefresrhTokenModel),
  userMiddleware.verifyRefereshToken,
  userController.getToken
);

router.get(
  '/profile',
  middleware.authorizationMiddleware,
  userController.getProfile
);

router.get('/all', middleware.authorizationMiddleware, userController.getUsers);

router.post(
  '/update',
  middleware.authorizationMiddleware,
  userController.updateUser
);

export const UserRoute: Router = router;
