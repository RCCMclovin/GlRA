import { Request, Response } from 'express';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import notificationService from './notification.service';
import { Notification } from '../../generated/prisma/client';

const index = async (req: Request, res: Response) => {
  /*
 #swagger.tags = ["Notifications"]
 #swagger.summary = 'Recupera todas as notificações do usuário logado.'
 #swagger.responses[200] = {
 schema: [{ $ref: '#/definitions/Notification' }]
 }
 #swagger.responses[403] = {
 description: 'User unautorized.'
 }
 #swagger.responses[500] = {
 description: "Internal Server Error"
 }
*/
  try {
    const notifications = await notificationService.index(req.session.uid as string);
    return res.json(notifications);
  } catch (e) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(e);
  }
};

const toggleRead = async (req: Request, res: Response) => {
  /*
 #swagger.tags = ["Notifications"]
 #swagger.summary = 'Atualiza uma notificação na base.'
 #swagger.parameters['notificationId'] = { description: 'ID da notificação' }
 #swagger.responses[200] = {
 description: 'Notificação Atualizada'
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
  let note: number = -1;
  try{
     note = Number(req.params.notificationId as string);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  }catch(e){
    return res.status(StatusCodes.NOT_ACCEPTABLE).send(ReasonPhrases.NOT_ACCEPTABLE);
  }
  try {
    const {id, receiverId, ...oldNote} = await notificationService.read(note) as Notification;
    if(!id){
        return res.status(StatusCodes.NOT_ACCEPTABLE).send(ReasonPhrases.NOT_ACCEPTABLE);
    }
    if(receiverId != req.session.uid){
        return res.status(StatusCodes.UNAUTHORIZED).send(ReasonPhrases.UNAUTHORIZED);
    }
    oldNote.read = oldNote.read? false : true;
    await notificationService.update(id, oldNote);
    return res.status(StatusCodes.CREATED).send(ReasonPhrases.CREATED);
  } catch (e) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(e);
  }
};

const remove = async (req: Request, res: Response) => {
  /*
 #swagger.tags = ["Notifications"]
 #swagger.summary = 'Remove uma notificação na base.'
 #swagger.parameters['NotificationId'] = { description: 'ID da notificação' }
 #swagger.responses[200] = {
 description: 'Notificação Removida'
 }
 #swagger.responses[403] = {
 description: 'User unautorized.'
 }
 #swagger.responses[406] = {
 description:  'Não existe uma notificação com o id informado.'
 }
 #swagger.responses[500] = {
 description: "Internal Server Error."
 }
*/
let note: number = -1;
  try{
     note = Number(req.params.notificationId as string);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  }catch(e){
    return res.status(StatusCodes.NOT_ACCEPTABLE).send(ReasonPhrases.NOT_ACCEPTABLE);
  }
 try {
   const old_note = await notificationService.read(note) as Notification;
    if(!old_note){
        return res.status(StatusCodes.NOT_ACCEPTABLE).send(ReasonPhrases.NOT_ACCEPTABLE);
    }
    if(old_note.receiverId != req.session.uid){
        return res.status(StatusCodes.UNAUTHORIZED).send(ReasonPhrases.UNAUTHORIZED);
    }
    await notificationService.remove(note);
    return res.status(StatusCodes.OK).send(ReasonPhrases.OK);
    
  } catch (e) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(e);
  }
};

export default {
    index,
    toggleRead,
    remove,
}