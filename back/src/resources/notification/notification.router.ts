import { Router } from 'express';
import isAuth from '../../middlewares/isAuth';
import notificationController from './notification.controller';


const router = Router();

router.get('/', isAuth, notificationController.index);
router.put('/:notificationId', isAuth, notificationController.toggleRead);
router.delete('/:notificationId', isAuth, notificationController.remove);

export default router;