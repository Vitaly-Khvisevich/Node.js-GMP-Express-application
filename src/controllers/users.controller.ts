import { Router, Request, Response } from 'express';
import * as userService from '../services/users.service';
import { createEmptyAnswer } from '../utils/helper.util';
import { userLogger } from '../logger';

const router = Router();

router.post('/register', async (req: Request, res: Response) => {
  const { email, password, role } = req.body;
  const user = await userService.createUser({ email, password, role });
  createEmptyAnswer(res, user!);
});

router.post('/login', async (req: Request, res: Response) => {
  const { email, password, role } = req.body;
  const user = await userService.getUserToken({ email, password, role });
  createEmptyAnswer(res, user!);
});

export default router;
