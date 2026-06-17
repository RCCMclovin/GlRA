import { Router } from 'express';
import authRouter from '../resources/auth/auth.router';
import findingRouter from '../resources/finding/finding.router';
import findingSeverityRouter from '../resources/findingSeverity/findingSeverity.router';
import findingStatusRouter from '../resources/findingStatus/findingStatus.router';
import findingTypesRouter from '../resources/findingTypes/findingTypes.router';
import mediaRouter from '../resources/media/media.router';
import notificationRouter from '../resources/notification/notification.router';
import projectRouter from '../resources/project/project.router';
import projectAccessRouter from '../resources/projectAccess/projectAccess.router';
import userRouter from '../resources/user/user.router';

const router = Router();

router.use('/auth', authRouter);
router.use('/finding', findingRouter);
router.use('/findingSeverity', findingSeverityRouter);
router.use('/findingStatus', findingStatusRouter);
router.use('/findingTypes', findingTypesRouter);
router.use('/notification', notificationRouter);
router.use('/media', mediaRouter);
router.use('/project', projectRouter);
router.use('/projectAccess', projectAccessRouter);
router.use('/user', userRouter);

export default router;