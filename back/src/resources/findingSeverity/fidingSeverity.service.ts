import { PrismaClient, FindingSeverity } from '../../generated/prisma/client';

const prisma = new PrismaClient();

async function index(): Promise<FindingSeverity[]>{
    return await prisma.findingSeverity.findMany();
}

async function translateId(id: string): Promise<string>{
    return ((await prisma.findingSeverity.findUnique({where:{id}}))?.name) || '';
}

export default {
    index,
    translateId,
}