import { Request, Response } from 'express';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import projectAccessService from './projectAccess.service';
import { UserDTO } from '../user/user.types';
import projectService from '../project/project.service';
import userService from '../user/user.service';
import { ProjectDTO } from '../project/project.types';
import notificationService from '../notification/notification.service';
import { Project } from '../../generated/prisma/client';

const grant = async (req: Request, res: Response) => {
  /*
 #swagger.tags = ["Project Access"]
 #swagger.summary = 'Adiciona um novo usuário no projeto.'
 #swagger.parameters['projectId'] = { description: 'ID do projeto' }
 #swagger.parameters['userId'] = { description: 'ID do usuário a ser adicionado' }
 #swagger.responses[201] = {
 description: 'Usuário Adicionado'
 }
 #swagger.responses[403] = {
 description: 'User unautorized.'
 }
 #swagger.responses[409] = {
 description:  'Já existe um usuário com o id informado neste projeto.'
 }
 #swagger.responses[500] = {
 description: "Internal Server Error."
 }
*/
  const newUser = req.params.userId as string;
  const project = req.params.projectId as string;
  try {
    const exists: boolean = await projectAccessService.hasAccess(project, newUser);
    if (!exists) {
      const projectInfo = await projectService.findProjectsById(project) as Project;
      await projectAccessService.grantAccess(project, newUser);
      notificationService.create(newUser, `Você foi adicionado no projeto ${projectInfo.title}`);
      return res.status(StatusCodes.CREATED).send(ReasonPhrases.CREATED);
    } else {
      return res.status(StatusCodes.CONFLICT).send(ReasonPhrases.CONFLICT);
    }
  } catch (e) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(e);
  }
};
const remove = async (req: Request, res: Response) => {
  /*
 #swagger.tags = ["Project Access"]
 #swagger.summary = 'Remove um usuário de um projeto.'
 #swagger.parameters['projectId'] = { description: 'ID do projeto' }
 #swagger.parameters['userId'] = { description: 'ID do usuário a ser adicionado' }
 #swagger.responses[200] = {
 description: 'Usuário removido'
 }
 #swagger.responses[403] = {
 description: 'User unautorized.'
 }
 #swagger.responses[406] = {
 description:  'Não existe um projeto com o id informado ou usuário já não tem acesso.'
 }
 #swagger.responses[500] = {
 description: "Internal Server Error."
 }
*/
  const newUser = req.params.userId as string;
  const project = req.params.projectId as string;
  try {
    const exists: boolean = await projectAccessService.hasAccess(project, newUser);
    if (exists) {
      const projectInfo = await projectService.findProjectsById(project) as Project;
      await projectAccessService.removeAccess(project, newUser);
      notificationService.create(newUser, `Você foi removido do projeto ${projectInfo.title}`);
      return res.status(StatusCodes.OK).send(ReasonPhrases.OK);
    } else {
      return res.status(StatusCodes.NOT_ACCEPTABLE).send(ReasonPhrases.NOT_ACCEPTABLE);
    }
  } catch (e) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(e);
  }
};
const listUsersByProject = async (req: Request, res: Response) => {
  /*
 #swagger.tags = ["Project Access"]
 #swagger.summary = 'Lista os usuários com acesso a um projeto.'
 #swagger.parameters['projectId'] = { description: 'ID do projeto' }
 #swagger.responses[200] = {
schema: [{ $ref: '#/definitions/UserDTO' }]
 }
 #swagger.responses[403] = {
 description: 'User unautorized.'
 }
 #swagger.responses[406] = {
 description:  'Não existe um projeto com o id informado.'
 }
 #swagger.responses[500] = {
 description: "Internal Server Error."
 }
*/
  const project = req.params.projectId as string;
  const users: UserDTO[] = [];
  try {
    const exists: boolean = await projectService.projectExists(project);
    if (exists) {
      await Promise.all((await projectAccessService.listUsersByProject(project)).map(async (u) =>{
        users.push(await userService.readUser(u.userId) as UserDTO);
      })).then(() => res.status(StatusCodes.OK).json(users));
    } else {
      return res.status(StatusCodes.NOT_ACCEPTABLE).send(ReasonPhrases.NOT_ACCEPTABLE);
    }
  } catch (e) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(e);
  }
};
const listProjectsByUser = async (req: Request, res: Response) => {
  /*
 #swagger.tags = ["Project Access"]
 #swagger.summary = 'Lista os projetos que o usuário logado tem acesso.'
 #swagger.responses[200] = {
schema: [{ $ref: '#/definitions/ProjectDTO' }]
 }
 #swagger.responses[403] = {
 description: 'User unautorized.'
 }
 #swagger.responses[406] = {
 description:  'Não existe um usuário com o id informado.'
 }
 #swagger.responses[500] = {
 description: "Internal Server Error."
 }
*/
  const user = req.session.uid as string;
  const projects: ProjectDTO[] = [];
  try {
    const exists: boolean = !!(await userService.readUser(user));
    if (exists) {
      await Promise.all((await projectAccessService.listProjectsByUser(user)).map(async (p) =>{
        projects.push(await projectService.findProjectsById(p.projectId) as ProjectDTO);
      })).then(() => res.status(StatusCodes.OK).json(projects));
    } else {
      return res.status(StatusCodes.NOT_ACCEPTABLE).send(ReasonPhrases.NOT_ACCEPTABLE);
    }
  } catch (e) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(e);
  }
};

export default {
    grant,
    remove,
    listUsersByProject,
    listProjectsByUser,
}