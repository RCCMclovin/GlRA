import { PrismaClient, Notification } from '../../generated/prisma/client';
import { NotificationDTO } from './notification.types';

const prisma = new PrismaClient();

async function index(userId:string): Promise<Notification[]> {
    return await prisma.notification.findMany({where:{receiverId: userId}});
}

async function create(receiverId: string, text: string): Promise<Notification> {
    return await prisma.notification.create({data:{
        receiverId, content: text, read:false
    }});
}

async function update(id: number, data: NotificationDTO ): Promise<void>{
    await prisma.notification.update({where:{id}, data})
}

async function remove(id: number): Promise<void>{
    await prisma.notification.delete({where:{id}});
}

async function read(id: number): Promise<Notification | null>{
    return await prisma.notification.findUnique({where:{id}});
}

export default {
    index,
    create,
    update,
    remove,
    read,
}