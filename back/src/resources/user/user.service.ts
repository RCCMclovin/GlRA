import { PrismaClient, User } from '../../generated/prisma/client';
import { CreateUserDTO, UserDTO, UpdateUserDTO, CardUser, SearchUser } from './user.types';
import { genSalt, hash } from 'bcryptjs';

const prisma = new PrismaClient();

async function getAllUsers(): Promise<UserDTO[]> {
  const users = await prisma.user.findMany();
  return users.map((u : User) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...user } = u;
    return user;
  });
}

async function findUserByEmail(email: string): Promise<User | null> {
  return await prisma.user.findUnique({ where: { email } });
}

async function createUser(user: CreateUserDTO): Promise<User> {
  const salt = await genSalt();
  const password = await hash(user.password, salt);
  return prisma.user.create({ data: { ...user, password } });
}

async function updateUser(id: string, user: UpdateUserDTO | CreateUserDTO ): Promise<User> {
  if("password" in user){
    const salt = await genSalt();
    const password = await hash(user.password, salt);
    return prisma.user.update({
      where: { id },
      data: { ...user, password },
    });
  }else{
    return prisma.user.update({
      where: { id },
      data: user,
    });
  }
}

async function removeUser(id: string): Promise<User> {
  return prisma.user.delete({
    where: { id },
  });
}

async function readUser(id: string): Promise<UserDTO | null> {
  const found = (await prisma.user.findUnique({
    where: { id },
  })) as User;
  if(!found) return null
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password, ...user } = found;
  return user;
}

async function readUserWithRole(id: string): Promise<UserDTO | null> {
  const found = (await prisma.user.findUnique({
    where: { id },
  })) as User;
  if(!found) return null
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password, ...user } = found;
  return user;
}

async function checkEmail(email: string): Promise<boolean> {
  return !!(await prisma.user.findUnique({ where: { email } }));
}

async function toCard(id: string): Promise<CardUser>{
  return (await prisma.user.findUnique({where:{id}, select:{id:true, name:true}})) as CardUser;
}

async function search(data: SearchUser): Promise<UserDTO[]> {
  const byName = await prisma.user.findMany({ where: { name: { contains: data.str } } });
  const byEmail = await prisma.user.findMany({ where: { email: { contains: data.str } } });
  const seen = new Set(byName.map((u) => u.id));
  for (const u of byEmail) {
    if (!seen.has(u.id)) byName.push(u);
  }
  return byName.map(({ password: _, ...u }) => u);
}

export default {
  getAllUsers,
  findUserByEmail,
  createUser,
  updateUser,
  removeUser,
  readUser,
  checkEmail,
  readUserWithRole,
  toCard,
  search,
};