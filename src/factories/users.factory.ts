import { setSeederFactory } from 'typeorm-extension';
import bcrypt from 'bcrypt';
import { User } from '../models/user';

export const UsersFactory = setSeederFactory(User, async (faker) => {
  const user = new User();
  user._id = '8ab265a0-a95f-4d61-92a7-93feca89602d';
  user.email = 'admin@test.com';
  user.password = await bcrypt.hash('adminForTest', 10);
  user.role = 'admin';
  return user;
});
