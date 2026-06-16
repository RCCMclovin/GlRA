import { PrismaClient, FindingStatus } from '../../generated/prisma/client';

const prisma = new PrismaClient();

async function index(): Promise<FindingStatus[]>{
    return await prisma.findingStatus.findMany();
}

export default {
    index,
}