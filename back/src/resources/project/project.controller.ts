import { Request, Response } from 'express';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import projectService from './project.service';
import { ProjectDTO } from './project.types';

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
    await projectService.create(project, req.session.uid as string);
    return res.status(StatusCodes.CREATED).send(ReasonPhrases.CREATED);
  } catch (e) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(e);
  }
};

const remove = async (req: Request, res: Response) => {
  /*
 #swagger.tags = ["Projetos"]
 #swagger.summary = 'Remove um projeto na base.'
 #swagger.parameters['ProjecId'] = { description: 'ID do projeto' }
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
  const project = req.params.projectId as string;
  try {
    await projectService.create(project, req.session.uid as string);
    return res.status(StatusCodes.CREATED).send(ReasonPhrases.CREATED);
  } catch (e) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(e);
  }
};


export default {
    index,
    create,
}