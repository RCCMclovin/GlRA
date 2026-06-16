import { PrismaClient, Project } from '../../generated/prisma/client';
import { ProjectDTO } from './project.types';

const prisma = new PrismaClient();

async function getAllProjects(): Promise<ProjectDTO[]> {
  return await prisma.project.findMany();
}

async function findProjectsById(id: string): Promise<ProjectDTO | null> {
  return await prisma.project.findUnique({ where: { id } });
}

async function projectExists(id: string): Promise<boolean> {
  return !!(await prisma.project.findUnique({ where: { id } }));
}

async function findProjectsByCreator(id: string): Promise<ProjectDTO[]> {
  return await prisma.project.findMany({ where: { creatorId: id } });
}

export default {
    getAllProjects,
    findProjectsById,
    projectExists,
    findProjectsByCreator,
}