import bcrypt from 'bcrypt';
import { myDataSource } from '../data-source';
import { User } from '../models/user';
import * as userType from '../schemas/user.entity';
import { logger } from '../logger';

export async function findByEmail(email:string):Promise<User | undefined> {
  let currentUser;
  await myDataSource.getRepository(User).findOneBy({ email })
    .then((user) => {
      if (user) {
        currentUser = user;
      }
    })
    .catch((error: Error) => logger.error(error.message));
  return currentUser;
}

export async function createUser(userData:userType.dataFromReq) {
  let isCreated = false;

  const emptyUser = new User();
  emptyUser.email = userData.email;
  emptyUser.password = await bcrypt.hash(userData.password, 10);
  if (userData.role) {
    emptyUser.role = userData.role;
    try {
      myDataSource.getRepository(User).save(emptyUser);
      isCreated = true;
    } catch (err: unknown) {
      logger.error(err);
    }
  }
  return isCreated;
}
