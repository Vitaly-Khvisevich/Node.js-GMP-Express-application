import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import { createEmptyError, getDurationInMilliseconds } from '../utils/helper.util';
import * as users from '../repositories/users.repository';
import { userLogger } from '../logger';
import 'dotenv/config';

export async function verifyToken(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return createEmptyError(res, 401, 'Token is required');
  }

  const [tokenType, token] = authHeader.split(' ');

  if (tokenType !== 'Bearer') {
    return createEmptyError(res, 403, 'Invalid Token');
  }

  try {
    const user = jwt.verify(token, process.env.TOKEN_KEY!);

    req.body.user = user;
  } catch (err) {
    return createEmptyError(res, 401, 'Invalid Token');
  }
  return next();
}

export async function authenticate(req:Request, res:Response, next:NextFunction) {
  const { email } = req.body.user;

  if (!email) {
    return createEmptyError(res, 401, 'You must be authorized user');
  }

  if (await !users.findByEmail(email)) {
    createEmptyError(res, 404, 'User is not authorized');
  }

  return next();
}

export async function Authorization(req: Request, res: Response, next: NextFunction) {
  const { role } = req.body.user;

  if (role !== 'admin') {
    return createEmptyError(res, 403, 'Only admin users can delete user cart');
  }

  return next();
}

export function logging(req: Request, res: Response, next: NextFunction) {
  const start = process.hrtime();

  res.on('finish', () => {
    const durationInMilliseconds = getDurationInMilliseconds(start);
    if (req.originalUrl && durationInMilliseconds) {
      const logMessage = `${req.method} ${req.originalUrl} - ${durationInMilliseconds}ms`;
      userLogger.info(logMessage);
    }
  });

  next();
}
