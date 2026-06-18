import { PrismaClient, Finding } from '../../generated/prisma/client';
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
    await prisma.finding.delete({where:{id}});
}

async function read(id: string): Promise<Finding | null>{
    return await prisma.finding.findUnique({where:{id}});
}

async function search(data: SearchFinding, projectId: string): Promise<Finding[]> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = { projectId };
    if (data.title) where.title = { contains: data.title };
    if (data.categoryId) where.categoryId = data.categoryId;
    if (data.severityId) where.severityId = data.severityId;
    if (data.statusId) where.statusId = data.statusId;
    if (data.assignedId) where.assignedId = data.assignedId;
    if (data.reporterId) where.reporterId = data.reporterId;
    return await prisma.finding.findMany({ where });
}

export default {
    index,
    create,
    update,
    remove,
    read,
    search,
}