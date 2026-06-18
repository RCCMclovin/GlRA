import { PrismaClient, Finding } from '../../generated/prisma/client';
import { FindingWhereInput } from '../../generated/prisma/models';
import mediaService from '../media/media.service';
import { CreateFindingDTO, SearchFinding, UpdateFindingDTO } from './finding.types';

const prisma = new PrismaClient();

async function index(projectId: string): Promise<Finding[]>{
    return await prisma.finding.findMany({where:{projectId}});
}

async function create(data: CreateFindingDTO, reporterId: string): Promise<Finding>{
    return await prisma.finding.create({data:{ ...data, reporterId}})
}

async function update(id: string, data: UpdateFindingDTO): Promise<void>{
    await prisma.finding.update({where:{id}, data});
}

async function remove(id: string): Promise<void>{
    Promise.all((await mediaService.getMediaByFinding(id)).map(async (m) =>{
        await mediaService.deleteMediaById(m.id);
    }))
    await prisma.finding.delete({where:{id}});
}

async function read(id: string): Promise<Finding | null>{
    return await prisma.finding.findUnique({where:{id}});
}

async function search(data: SearchFinding, projectId: string) {
    const where: FindingWhereInput= {projectId};
    if(data.title){
        where.title = {contains: data.title};
    }
    if(data.categoryId){
        where.categoryId = data.categoryId;
    }
    if(data.severityId){
        where.severityId = data.severityId;
    }
    if(data.statusId){
        where.statusId = data.statusId;
    }
    return await prisma.finding.findMany({
        where:where,
    })
}

export default {
    index,
    create,
    update,
    remove,
    read,
    search
}