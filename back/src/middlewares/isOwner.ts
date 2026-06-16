import { NextFunction, Request, Response } from 'express';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import projectService from '../resources/project/project.service';
import { Project } from '../generated/prisma/client';

async function isOwner(req: Request, res: Response, next: NextFunction) {
  const paramProject = req.params.projectId as string;
  const project = await projectService.findProjectsById(paramProject) as Project;
  if(req.session.uid && project.creatorId != req.session.uid){
    return res.status(StatusCodes.FORBIDDEN).send(ReasonPhrases.FORBIDDEN);
  } else next();
}

export default isOwner;