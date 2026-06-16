import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import FindingTypesService from './fidingTypes.service';

const index = async (req: Request, res: Response) => {
  /*
 #swagger.tags = ["Tipos de Achados"]
 #swagger.summary = 'Recupera dados de todos os tipos de achado.'
 #swagger.responses[200] = {
 schema: [{ $ref: '#/definitions/FindingType' }]
 }
 #swagger.responses[403] = {
 description: 'User unautorized.'
 }
 #swagger.responses[500] = {
 description: "Internal Server Error"
 }
*/
  try {
    const users = await FindingTypesService.index();
    return res.json(users);
  } catch (e) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(e);
  }
};

export default {
    index,
}