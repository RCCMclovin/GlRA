import { PrismaClient, FindingType } from '../../generated/prisma/client';

const prisma = new PrismaClient();

async function index(): Promise<FindingType[]>{
    return await prisma.findingType.findMany();
}

async function translateId(id: string): Promise<string>{
    return ((await prisma.findingType.findUnique({where:{id}}))?.name) || '';
}

export default {
    index,
    translateId,
}