import { NextFunction, Request, Response } from 'express';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import projectAccessService from '../resources/projectAccess/projectAccess.service';
import findingService from '../resources/finding/finding.service';

async function hasAccess(req: Request, res: Response, next: NextFunction) {
  let project: string | undefined = req.params.projectId as string;
  if(!project && req.body){
    project = req.body.projectId;
  }
  if(!project && req.params.findingId){
    project = (await findingService.read(req.params.findingId as string))?.projectId
  }
  if(!project || !req.session.uid || !(await projectAccessService.hasAccess(project, req.session.uid))){
    return res.status(StatusCodes.FORBIDDEN).send(ReasonPhrases.FORBIDDEN);
  } else next();
  
}

export default hasAccess;

