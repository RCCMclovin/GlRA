import { PrismaClient, FindingType } from '../../generated/prisma/client';

const prisma = new PrismaClient();

async function index(): Promise<FindingType[]>{
    return await prisma.findingType.findMany();
}

export default {
    index,
}