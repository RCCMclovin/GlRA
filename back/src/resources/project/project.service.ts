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
  return await prisma.project.findMany({ where: { creatorId: id }, orderBy:{createdAt: 'desc'} });
}

async function create(data: ProjectDTO, creatorId: string): Promise<Project>{
  return await prisma.project.create({data:{ ...data, creatorId}});
}

async function update(id: string, data: ProjectDTO): Promise<Project>{
  return await prisma.project.update({data: data, where:{id}});
}

async function remove(id: string): Promise<void>{
  await prisma.accessProject.deleteMany({where:{projectId: id}});
  await prisma.project.delete({where:{id}});
}

async function search(text: string, userId: string): Promise<Project[]>{
  return await prisma.project.findMany({
    where:{title:{contains:text}, creatorId:userId}, 
    orderBy:{createdAt:'desc'}
  })
}

export default {
    getAllProjects,
    findProjectsById,
    projectExists,
    findProjectsByCreator,
    create,
    update,
    remove,
    search,
}