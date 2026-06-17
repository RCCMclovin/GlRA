import { Router } from 'express';
import isAuth from '../../middlewares/isAuth';
import { validate } from '../../middlewares/validate';
import { projectSchema } from './project.schema';
import projectController from './project.controller';
import hasAccess from '../../middlewares/hasAccess';
import isOwner from '../../middlewares/isOwner';

const router = Router();

router.get('/', isAuth, projectController.index);
router.post('/', isAuth, validate(projectSchema), projectController.create);
router.put('/:projectId', hasAccess, validate(projectSchema), projectController.update);
router.delete('/:projectId', isOwner, projectController.remove);
router.get('/:projectId', hasAccess, projectController.read);

export default router;