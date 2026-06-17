import { Router } from 'express';
import mediaController from './media.controller';
import isAuth from '../../middlewares/isAuth';
import hasAccess from '../../middlewares/hasAccess';

const router = Router();

router.post('/', isAuth, mediaController.create);
router.get('/index/:findingId', hasAccess, mediaController.index);
router.post('/:findingId', isAuth, mediaController.createForFinding);
router.delete('/:mediaId', isAuth, mediaController.remove);
router.get('/:id', mediaController.getMediaById);


export default router;