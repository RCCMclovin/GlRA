import { Request, Response } from 'express';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import projectService from './project.service';
import { ProjectDTO } from './project.types';
import { Project } from '../../generated/prisma/client';
import projectAccessService from '../projectAccess/projectAccess.service';

const index = async (req: Request, res: Response) => {
  /*
 #swagger.tags = ["Projetos"]
 #swagger.summary = 'Recupera todos os projetos do usuário logado.'
 #swagger.responses[200] = {
 schema: [{ $ref: '#/definitions/Project' }]
 }
 #swagger.responses[403] = {
 description: 'User unautorized.'
 }
 #swagger.responses[500] = {
 description: "Internal Server Error"
 }
*/
  try {
    const projects = await projectService.findProjectsByCreator(req.session.uid as string);
    return res.json(projects);
  } catch (e) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(e);
  }
};

const create = async (req: Request, res: Response) => {
  /*
 #swagger.tags = ["Projetos"]
 #swagger.summary = 'Adiciona um novo projeto na base.'
 #swagger.parameters['body'] = {
 in: 'body',
 schema: { $ref: '#/definitions/ProjectDTO' }
 } 
 #swagger.responses[201] = {
 description: 'Projeto Criado'
 }
 #swagger.responses[403] = {
 description: 'User unautorized.'
 }
 #swagger.responses[422] = {
 description:  'Body inválido.'
 }
 #swagger.responses[500] = {
 description: "Internal Server Error."
 }
*/
  const project = req.body as ProjectDTO;
  try {
    const new_project = await projectService.create(project, req.session.uid as string);
    await projectAccessService.grantAccess(new_project.id, new_project.creatorId);
    return res.status(StatusCodes.CREATED).send(ReasonPhrases.CREATED);
  } catch (e) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(e);
  }
};

const update = async (req: Request, res: Response) => {
  /*
 #swagger.tags = ["Projetos"]
 #swagger.summary = 'Atualiza um projeto na base.'
 #swagger.parameters['projectId'] = { description: 'ID do projeto' }
 #swagger.parameters['body'] = {
 in: 'body',
 schema: { $ref: '#/definitions/ProjectDTO' }
 } 
 #swagger.responses[200] = {
 description: 'Projeto Atualizado'
 }
 #swagger.responses[403] = {
 description: 'User unautorized.'
 }
 #swagger.responses[422] = {
 description:  'Body inválido.'
 }
 #swagger.responses[500] = {
 description: "Internal Server Error."
 }
*/
  const project = req.body as ProjectDTO;
  try {
    await projectService.update(req.params.projectId as string, project);
    return res.status(StatusCodes.CREATED).send(ReasonPhrases.CREATED);
  } catch (e) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(e);
  }
};

const remove = async (req: Request, res: Response) => {
  /*
 #swagger.tags = ["Projetos"]
 #swagger.summary = 'Remove um projeto na base.'
 #swagger.parameters['projectId'] = { description: 'ID do projeto' }
 #swagger.responses[200] = {
 description: 'Projeto Removido'
 }
 #swagger.responses[403] = {
 description: 'User unautorized.'
 }
 #swagger.responses[406] = {
 description:  'Não existe um projeto com o id informado.'
 }
 #swagger.responses[422] = {
 description:  'Body inválido.'
 }
 #swagger.responses[500] = {
 description: "Internal Server Error."
 }
*/
 try {
   const project = await projectService.findProjectsById(req.params.projectId as string) as Project;
    if(project){
        await projectService.remove(project.id);
        return res.status(StatusCodes.OK).send(ReasonPhrases.OK);
    }else{
        return res.status(StatusCodes.NOT_ACCEPTABLE).send(ReasonPhrases.NOT_ACCEPTABLE);
    }
  } catch (e) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(e);
  }
};

const read = async (req: Request, res: Response) => {
  /*
 #swagger.tags = ["Projetos"]
 #swagger.summary = 'Recupera dados de um projeto específico.'
 #swagger.parameters['projectId'] = { description: 'ID do projeto' }
 #swagger.responses[200] = {
 schema: { $ref: '#/definitions/Project' }
 }
 #swagger.responses[403] = {
 description: 'User unautorized.'
 }
 #swagger.responses[406] = {
 description:  'Não existe um projeto com o id informado.'
 }
 #swagger.responses[500] = {
 description: "Internal Server Error"
 }
*/
  try {
    const project = await projectService.findProjectsById(req.params.projectId as string);
    if(project){
        return res.json(project);
    }else{
        return res.status(StatusCodes.NOT_ACCEPTABLE).send(ReasonPhrases.NOT_ACCEPTABLE);
    }
  } catch (e) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(e);
  }
};


export default {
    index,
    create,
    update,
    remove,
    read,
}