import { Router } from 'express';
import isAuth from '../../middlewares/isAuth';
import hasAccess from '../../middlewares/hasAccess';
import projectAccessController from './projectAccess.controller';

const router = Router();

router.get('/', isAuth, projectAccessController.listProjectsByUser);
router.post('/p/:projectId/u/:UserId', hasAccess, projectAccessController.grant);
router.delete('/p/:projectId/u/:UserId', hasAccess, projectAccessController.remove);
router.get('/:projectId', hasAccess, projectAccessController.listUsersByProject);

export default router;