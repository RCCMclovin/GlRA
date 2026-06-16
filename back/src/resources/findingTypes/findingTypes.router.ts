import { Router } from 'express';
import isAuth from '../../middlewares/isAuth';
import findingTypesController from './findingTypes.controller';

const router = Router();

router.get('/', isAuth, findingTypesController.index);

export default router;