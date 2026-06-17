import { Router } from 'express';
import userController from './user.controller';
import { userSchema } from './user.schema';
import { validate } from '../../middlewares/validate';
import isAuth from '../../middlewares/isAuth';

const router = Router();

router.get('/', userController.index);
//router.post('/', validate(userSchema), userController.create);
router.get('/checkemail/:email', userController.checkEmail);
router.get('/:userId', isAuth, userController.read);
router.put(
  '/:userId',
  validate(userSchema),
  userController.update,
);
router.delete('/:userId', userController.remove);


export default router;