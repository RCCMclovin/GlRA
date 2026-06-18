import { Request, Response } from 'express';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import MediaService from './media.service';
import { MediaDTO } from './media.types';
import { randomUUID } from 'crypto';
import path from 'path';
import projectAccessService from '../projectAccess/projectAccess.service';
import findingService from '../finding/finding.service';
import { Media } from '../../generated/prisma/browser';
import mediaService from './media.service';

const create = async (req: Request, res: Response) => {
  /*
     #swagger.tags = ["Mídia"]
     #swagger.summary = 'Adiciona um novo arquivo na base.'
     #swagger.parameters['body'] = {
     in: 'body',
     type: 'file',
     required: true,
     description: 'Arquivo de mídia a ser adicionado.'
     } 
    #swagger.responses[201] = {
     schema: { $ref: '#/definitions/Media' }
     }
    #swagger.responses[403] = {
     description: 'User unautorized.'
    }
    */
  try {
    const type = req.headers['content-type']?.substring(
      req.headers['content-type'].lastIndexOf('/') + 1,
    );
    const media = {
      name: `${randomUUID()}.${type}`,
      data: req.body as Blob,
    } as MediaDTO;
    const newMedia = await MediaService.createMedia(media);
    newMedia.link =
      process.env.NODE_ENV === 'production'
        ? `https://glraback.rcchome.com.br/v1/media/${newMedia.id}`
        : `http://localhost:3333/v1/media/${newMedia.id}`;
    res.status(StatusCodes.CREATED).json(newMedia);
  } catch (e) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(e);
  }
};

const createForFinding = async (req: Request, res: Response) => {
  /*
     #swagger.tags = ["Mídia"]
     #swagger.summary = 'Adiciona um novo arquivo na base.'
     #swagger.parameters['findingId'] = { description: 'ID do achado' }
     #swagger.parameters['body'] = {
     in: 'body',
     type: 'file',
     required: true,
     description: 'Arquivo de mídia a ser adicionado.'
     } 
    #swagger.responses[201] = {
     schema: { $ref: '#/definitions/Media' }
     }
    #swagger.responses[403] = {
     description: 'User unautorized.'
    }
    */
  try {
    const type = req.headers['content-type']?.substring(
      req.headers['content-type'].lastIndexOf('/') + 1,
    );
    const media = {
      name: `${randomUUID()}.${type}`,
      data: req.body as Blob,
    } as MediaDTO;
    const newMedia = await MediaService.createMedia(media);
    newMedia.link =
      process.env.NODE_ENV === 'production'
        ? `https://glraback.rcchome.com.br/v1/media/${newMedia.id}`
        : `http://localhost:3333/v1/media/${newMedia.id}`;
    await mediaService.vinculateMediaFinding(newMedia.id, req.params.findingId as string)
    res.status(StatusCodes.CREATED).json(newMedia);
  } catch (e) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(e);
  }
};

const remove = async (req: Request, res: Response) => {
  /*
 #swagger.tags = ["Mídia"]
 #swagger.summary = 'Remove uma mídia na base.'
 #swagger.parameters['mediaId'] = { description: 'ID da mídia' }
 #swagger.responses[200] = {
 description: 'Mídia Removida'
 }
 #swagger.responses[403] = {
 description: 'User unautorized.'
 }
 #swagger.responses[406] = {
 description:  'Não existe uma mídia com o id informado.'
 }
 #swagger.responses[500] = {
 description: "Internal Server Error."
 }
*/
  try {
    const id = req.params.mediaId as string;
    if(!(await MediaService.getMediaById(id))){
        return res.status(StatusCodes.NOT_ACCEPTABLE).send(ReasonPhrases.NOT_ACCEPTABLE);
    }
    const findingId = await MediaService.getFindingByMedia(id);
    if (findingId) {
      const finding = await findingService.read(findingId);
      if (!finding || !(await projectAccessService.hasAccess(finding.projectId, req.session.uid as string))) {
        return res.status(StatusCodes.FORBIDDEN).send(ReasonPhrases.FORBIDDEN);
      }
    }
    await MediaService.deleteMediaById(id);
    return res.status(StatusCodes.OK).send(ReasonPhrases.OK);
  } catch (e) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(e);
  }
};

const getMediaById = async (req: Request, res: Response) => {
  /*
    #swagger.tags = ["Mídia"]
    #swagger.summary = 'Recupera um arquivo da base.'
    #swagger.parameters['id'] = { description: 'ID do arquivo a ser recuperado.' }
    #swagger.responses[200] = {
     schema: { $ref: '#/definitions/MediaDTO' }
    }
    #swagger.responses[403] = {
     description: 'User unautorized.'
    }
*/
  try {
    const id = req.params.id as string;
    const media = await MediaService.getMediaById(id);
    const absolutePath = path.resolve(media);
    res.sendFile(absolutePath);
  } catch (e) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(e);
  }
};

const index = async (req: Request, res: Response) => {
  /*
 #swagger.tags = ["Mídia"]
 #swagger.summary = 'Recupera todas as mídias do achado.'
 #swagger.parameters['findingId'] = { description: 'ID do achado' }
 #swagger.responses[200] = {
 schema: [{ $ref: '#/definitions/Media' }]
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
    const finding = await findingService.read(req.params.findingId as string);
    
    if(!finding){
        return res.status(StatusCodes.NOT_ACCEPTABLE).send(ReasonPhrases.NOT_ACCEPTABLE);
    }
    const medias: Media[] = await MediaService.getMediaByFinding(finding.id)
    return res.status(StatusCodes.OK).json(medias);
  } catch (e) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(e);
  }
};

export default {
  create,
  remove,
  getMediaById,
  index,
  createForFinding,
};