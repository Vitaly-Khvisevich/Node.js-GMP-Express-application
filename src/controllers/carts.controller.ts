import { Router, Request, Response } from 'express';
import Joi from 'joi';
import * as cartService from '../services/carts.service';
import { createEmptyAnswer, createEmptyError } from '../utils/helper.util';
import { Authorization } from '../middlewares/middlewares';
import { logger } from '../logger';

const router = Router();
const schema = Joi.object().keys({
  productId: Joi.string().min(16).required(),
  count: Joi.number().integer().min(0).required(),
  user: Joi.required(),
});

router.get('/', async (req: Request, res: Response) => {
  const { email } = req.body.user;
  const cart = await cartService.getCartForUser(email!);
  if (cart) {
    createEmptyAnswer(res, cart);
  } else {
    logger.error('Server error');
  }
});

router.put('/', async (req: Request, res: Response) => {
  const validationResult = schema.validate(req.body);
  let result;
  if (validationResult.error) {
    createEmptyError(res, 400, validationResult.error.message);
  } else {
    const { email } = req.body.user;

    result = await cartService.updateCartData(email, req.body);
    createEmptyAnswer(res, result!);
  }
});

router.delete('/', Authorization, async (req: Request, res: Response) => {
  const { email } = req.body.user;
  const emptyProduct = await cartService.deleteCart(email);
  createEmptyAnswer(res, emptyProduct!);
});

router.post('/checkout', async (req: Request, res: Response) => {
  const { email } = req.body.user;
  const order = await cartService.createNewOrder(email);
  createEmptyAnswer(res, order!);
});

export default router;
