import { Router } from 'express';
import hasAccess from '../../middlewares/hasAccess';
import { validate } from '../../middlewares/validate';
import { findingSchema, updateFindingSchema, searchFindingSchema } from './finding.schema';
import findingController from './finding.controller';

const router = Router();

router.get('/p/:projectId', hasAccess, findingController.index);
router.post('/search/:projectId', hasAccess, validate(searchFindingSchema), findingController.search);
router.get('/:findingId', hasAccess, findingController.read);
router.post('/', hasAccess, validate(findingSchema), findingController.create);
router.put('/:findingId', hasAccess, validate(updateFindingSchema), findingController.update);
router.delete('/:findingId', hasAccess, findingController.remove);

export default router;