import { PrismaClient } from '../../generated/prisma/client';
import { ProjectList, UserList } from './projectAccess.types';


const prisma = new PrismaClient();


async function grantAccess(projectId: string, userId: string): Promise<void>{
    await prisma.accessProject.create({data:{projectId, userId}});
}

async function removeAccess(projectId: string, userId: string): Promise<void>{
    await prisma.accessProject.delete({where:{userId_projectId:{userId, projectId}}});
}

async function hasAccess(projectId: string, userId: string): Promise<boolean>{
    return !!(await prisma.accessProject.findUnique({where:{userId_projectId:{userId, projectId}}}));
}

async function listUsersByProject(projectId: string): Promise<UserList[]>{
    return await prisma.accessProject.findMany({select: {'userId': true}, where:{projectId}});
}

async function listProjectsByUser(userId: string): Promise<ProjectList[]>{
    return await prisma.accessProject.findMany({select: {'projectId': true}, where:{userId}});
}

export default {
    grantAccess,
    removeAccess,
    listUsersByProject,
    listProjectsByUser,
    hasAccess,
}