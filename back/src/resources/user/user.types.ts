import { User } from '../../generated/prisma/client';

export type CreateUserDTO = Pick<
  User,
  'name' | 'email' | 'password'
>;

export type UpdateUserDTO = Pick<
  User,
  'name' | 'email'
>;

export type UserDTO = Omit<User, 'password'>;

export type CardUser = Pick<User, 'id' | 'name'>;

export type SearchUser = {
  email?:string,
  name?: string
}
