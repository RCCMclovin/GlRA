import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import FindingSeverityService from './fidingSeverity.service';

const index = async (req: Request, res: Response) => {
  /*
 #swagger.tags = ["Severidade de Achados"]
 #swagger.summary = 'Recupera dados de todas as severiades de achado.'
 #swagger.responses[200] = {
 schema: [{ $ref: '#/definitions/FindingSeverity' }]
 }
 #swagger.responses[403] = {
 description: 'User unautorized.'
 }
 #swagger.responses[500] = {
 description: "Internal Server Error"
 }
*/
  try {
    const users = await FindingSeverityService.index();
    return res.json(users);
  } catch (e) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(e);
  }
};

export default {
    index,
}