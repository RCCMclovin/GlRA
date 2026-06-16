import { AccessProject } from '../../generated/prisma/client';

export type UserList = Pick<AccessProject, 'userId'>;
export type ProjectList = Pick<AccessProject, 'projectId'>;