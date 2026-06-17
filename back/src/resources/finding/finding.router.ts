import { Router } from 'express';
import hasAccess from '../../middlewares/hasAccess';
import findingController from './finding.controller';


const router = Router();

router.get('/p/:projectId', hasAccess, findingController.index);
router.get('/:findingId', hasAccess, findingController.read);
router.post('/', hasAccess, findingController.create);
router.put('/:findingId', hasAccess, findingController.update);
router.delete('/:findingId', hasAccess, findingController.remove);

export default router;