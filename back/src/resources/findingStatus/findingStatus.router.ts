import { Router } from 'express';
import isAuth from '../../middlewares/isAuth';
import findingStatusController from './findingStatus.controller';

const router = Router();

router.get('/', isAuth, findingStatusController.index);

export default router;