import { Request, Response } from 'express';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import findingService from './finding.service';
import findingTypeService from '../findingTypes/fidingTypes.service';
import findingStatusService from '../findingStatus/fidingStatus.service';
import findingSeverityService from '../findingSeverity/fidingSeverity.service';
import { Project } from '../../generated/prisma/client';
import projectService from '../project/project.service';
import { CreateFindingDTO, FindingPublic } from './finding.types';
import userService from '../user/user.service';
import { Finding } from '../../generated/prisma/browser';

const index = async (req: Request, res: Response) => {
  /*
 #swagger.tags = ["Achados"]
 #swagger.summary = 'Recupera dados de todos os achados de um projeto.'
 #swagger.parameters['ProjecId'] = { description: 'ID do projeto' }
 #swagger.responses[200] = {
 schema: [{ $ref: '#/definitions/FindingPublic' }]
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
     const project = await projectService.findProjectsById(req.params.projectId as string) as Project;
      if(project){
          const findings: FindingPublic[] = [];
          (await findingService.index(project.id)).forEach(async (f) => {
            const public_fiding: FindingPublic = {
                id:f.id,
                title:f.title,
                description: f.description,
                solution: f.solution,
                projectId: f.projectId,
                category: await findingTypeService.translateId(f.categoryId) ,
                severity: await findingSeverityService.translateId(f.severityId),
                status: await findingStatusService.translateId(f.statusId),
                reporter: await userService.toCard(f.reporterId),
                assigned: await userService.toCard(f.assignedId),
            }
            findings.push(public_fiding);
          })
          return res.status(StatusCodes.OK).json(findings);
      }else{
          return res.status(StatusCodes.NOT_ACCEPTABLE).send(ReasonPhrases.NOT_ACCEPTABLE);
      }
    } catch (e) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(e);
    }
};

const read = async (req: Request, res: Response) => {
  /*
 #swagger.tags = ["Achados"]
 #swagger.summary = 'Recupera dados de um achado específico.'
 #swagger.parameters['findingId'] = { description: 'ID do achado' }
 #swagger.responses[200] = {
 schema: { $ref: '#/definitions/FindingPublic' }
 }
 #swagger.responses[403] = {
 description: 'User unautorized.'
 }
 #swagger.responses[406] = {
 description:  'Não existe um achado com o id informado.'
 }
 #swagger.responses[500] = {
 description: "Internal Server Error"
 }
*/
  try {
    const f = await findingService.read(req.params.findingId as string);
    if(f){
        const finding: FindingPublic = {
            id:f.id,
            title:f.title,
            description: f.description,
            solution: f.solution,
            projectId: f.projectId,
            category: await findingTypeService.translateId(f.categoryId) ,
            severity: await findingSeverityService.translateId(f.severityId),
            status: await findingStatusService.translateId(f.statusId),
            reporter: await userService.toCard(f.reporterId),
            assigned: await userService.toCard(f.assignedId),
        }
        return res.json(finding);
    }else{
        return res.status(StatusCodes.NOT_ACCEPTABLE).send(ReasonPhrases.NOT_ACCEPTABLE);
    }
  } catch (e) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(e);
  }
};

const create = async (req: Request, res: Response) => {
  /*
 #swagger.tags = ["Achados"]
 #swagger.summary = 'Adiciona um novo achado no projeto.'
 #swagger.parameters['body'] = {
 in: 'body',
 schema: { $ref: '#/definitions/CreateFindingDTO' }
 } 
 #swagger.responses[201] = {
 description: 'Achado Criado'
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
  const finding = req.body as CreateFindingDTO;
  try {
    await findingService.create(finding, req.session.uid as string);
    return res.status(StatusCodes.CREATED).send(ReasonPhrases.CREATED);
  } catch (e) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(e);
  }
};

const update = async (req: Request, res: Response) => {
  /*
 #swagger.tags = ["Achados"]
 #swagger.summary = 'Atualiza um achado no projeto.'
 #swagger.parameters['findingId'] = { description: 'ID do achado' }
 #swagger.parameters['body'] = {
 in: 'body',
 schema: { $ref: '#/definitions/CreateFindingDTO' }
 } 
 #swagger.responses[200] = {
 description: 'Achado atualizado'
 }
 #swagger.responses[403] = {
 description: 'User unautorized.'
 }
 #swagger.responses[406] = {
 description:  'Não existe um achado com o id informado.'
 }
 #swagger.responses[422] = {
 description:  'Body inválido.'
 }
 #swagger.responses[500] = {
 description: "Internal Server Error."
 }
*/
  const new_finding = req.body as CreateFindingDTO;
  try {
    const finding = await findingService.read(req.params.findingId as string);
    if(finding){
        await findingService.update(req.params.findingId as string, new_finding);
        return res.status(StatusCodes.CREATED).send(ReasonPhrases.CREATED);
    }else{
        return res.status(StatusCodes.NOT_ACCEPTABLE).send(ReasonPhrases.NOT_ACCEPTABLE);
    }
    
  } catch (e) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(e);
  }
};

const remove = async (req: Request, res: Response) => {
  /*
 #swagger.tags = ["Achados"]
 #swagger.summary = 'Remove um achado na base.'
 #swagger.parameters['findingId'] = { description: 'ID do achado' }
 #swagger.responses[200] = {
 description: 'Achado Removido'
 }
 #swagger.responses[403] = {
 description: 'User unautorized.'
 }
 #swagger.responses[406] = {
 description:  'Não existe um achado com o id informado.'
 }
 #swagger.responses[422] = {
 description:  'Body inválido.'
 }
 #swagger.responses[500] = {
 description: "Internal Server Error."
 }
*/
 try {
   const finding = await findingService.read(req.params.findingId as string) as Finding;
    if(finding){
        await findingService.remove(finding.id);
        return res.status(StatusCodes.OK).send(ReasonPhrases.OK);
    }else{
        return res.status(StatusCodes.NOT_ACCEPTABLE).send(ReasonPhrases.NOT_ACCEPTABLE);
    }
  } catch (e) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(e);
  }
};

export default {
    index,
    read,
    create,
    update,
    remove,
}