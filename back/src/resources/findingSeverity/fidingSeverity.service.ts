import { PrismaClient, FindingSeverity } from '../../generated/prisma/client';

const prisma = new PrismaClient();

async function index(): Promise<FindingSeverity[]>{
    return await prisma.findingSeverity.findMany();
}

export default {
    index,
}