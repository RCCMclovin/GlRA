import { Router } from 'express';
import isAuth from '../../middlewares/isAuth';
import findingSeverityController from './findingSeverity.controller';

const router = Router();

router.get('/', isAuth, findingSeverityController.index);

export default router;