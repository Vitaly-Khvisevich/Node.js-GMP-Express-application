import bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import * as userRepository from '../repositories/users.repository';
import * as userType from '../schemas/user.entity';
import { createBodyOfResponse } from '../utils/helper.util';
import 'dotenv/config';

function emailValidation(email:string) {
  const reg = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
  return reg.test(String(email).toLowerCase());
}

export async function createUser(userData:userType.dataFromReq) {
  let answer;
  const x = emailValidation(userData.email);
  if (emailValidation(userData.email) && await !!userRepository.findByEmail(userData.email)) {
    const isCreated = await userRepository.createUser(userData);
    if (isCreated) {
      const user = await userRepository.findByEmail(userData.email) as
      userType.UserEntity | undefined;
      answer = createBodyOfResponse(
        200,
        null,
        { id: user?._id, email: user?.email, role: user?.role },
      );
    } else {
      answer = createBodyOfResponse(500, 'Internal Server error');
    }
  } else {
    answer = createBodyOfResponse(400, 'Email is nod valid');
  }
  return answer;
}

export async function getUserToken(userData:userType.dataFromReq) {
  let answer;
  const TOKEN_KEY = process.env.TOKEN_KEY!;
  const user = await userRepository.findByEmail(userData.email) as userType.UserEntity | undefined;
  if (user && (await bcrypt.compare(userData.password, user.password))) {
    const token = jwt.sign(
      { user_id: user._id, email: user.email, role: user.role },
      TOKEN_KEY!,
      {
        expiresIn: '2h',
      },
    );

    answer = createBodyOfResponse(200, null, { token });
  } else {
    answer = createBodyOfResponse(404, 'No user with such email or password');
  }
  return answer;
}
