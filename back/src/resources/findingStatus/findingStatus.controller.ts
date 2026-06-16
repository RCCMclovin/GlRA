import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import FindingStatusService from './fidingStatus.service';

const index = async (req: Request, res: Response) => {
  /*
 #swagger.tags = ["Status de Achados"]
 #swagger.summary = 'Recupera dados de todos os status de achado.'
 #swagger.responses[200] = {
 schema: [{ $ref: '#/definitions/FindingStatus' }]
 }
 #swagger.responses[403] = {
 description: 'User unautorized.'
 }
 #swagger.responses[500] = {
 description: "Internal Server Error"
 }
*/
  try {
    const users = await FindingStatusService.index();
    return res.json(users);
  } catch (e) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(e);
  }
};

export default {
    index,
}