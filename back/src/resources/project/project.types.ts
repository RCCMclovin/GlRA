import { Project } from '../../generated/prisma/client';

export type ProjectDTO = Pick<Project, 'title' | 'description'>;