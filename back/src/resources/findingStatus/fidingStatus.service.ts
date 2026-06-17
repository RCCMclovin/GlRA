import { PrismaClient, FindingStatus } from '../../generated/prisma/client';

const prisma = new PrismaClient();

async function index(): Promise<FindingStatus[]>{
    return await prisma.findingStatus.findMany();
}

async function translateId(id: string): Promise<string>{
    return ((await prisma.findingStatus.findUnique({where:{id}}))?.name) || '';
}

export default {
    index,
    translateId,
}