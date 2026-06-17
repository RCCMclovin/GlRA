import { Finding } from "../../generated/prisma/client";

export type FindingPublic = Omit<Finding, 
'categoryId'| 'reporterId' | 'severityId' | 'statusId' | 'assignedId'> &
{   category: string, 
    reporter: {id: string, name: string},
    severity: string,
    status: string,
    assigned: {id: string, name: string},
}

export type CreateFindingDTO = Omit<Finding, 'id' | 'reporterId'>;