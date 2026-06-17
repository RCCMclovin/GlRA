import { NextFunction, Request, Response } from 'express';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import projectAccessService from '../resources/projectAccess/projectAccess.service';

async function hasAccess(req: Request, res: Response, next: NextFunction) {
  const project = req.params.projectId as string;
  if(!req.session.uid || !(await projectAccessService.hasAccess(project, req.session.uid))){
    return res.status(StatusCodes.FORBIDDEN).send(ReasonPhrases.FORBIDDEN);
  } else next();
}

export default hasAccess;

