import { PrismaClient, Finding } from '../../generated/prisma/client';
import { CreateFindingDTO } from './finding.types';

const prisma = new PrismaClient();

async function index(projectId: string): Promise<Finding[]>{
    return await prisma.finding.findMany({where:{projectId}});
}

async function create(data: CreateFindingDTO, reporterId: string): Promise<Finding>{
    return await prisma.finding.create({data:{ ...data, reporterId}})
}

async function update(id: string, data: CreateFindingDTO): Promise<void>{
    await prisma.finding.update({where:{id}, data});
}

async function remove(id: string): Promise<void>{
    await prisma.finding.delete({where:{id}});
}

async function read(id: string): Promise<Finding | null>{
    return await prisma.finding.findUnique({where:{id}});
}

export default {
    index,
    create,
    update,
    remove,
    read,
}