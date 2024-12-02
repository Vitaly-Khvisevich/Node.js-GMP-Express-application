import { Router, Request, Response } from 'express';
import Joi from 'joi';
import * as productsService from '../services/products.service';
import { createEmptyAnswer, createEmptyError } from '../utils/helper.util';

const router = Router();
const schema = Joi.string().min(16).required();

router.get('/', async (req: Request, res: Response) => {
  const products = await productsService.getProducts();
  createEmptyAnswer(res, products);
});

router.get('/:ProductId', async (req: Request, res: Response) => {
  const productId = req.params.ProductId;
  const validationResult = schema.validate(productId);
  let result;
  if (validationResult.error) {
    createEmptyError(res, 404, validationResult.error.message);
  } else {
    result = await productsService.getProductById(productId);
    createEmptyAnswer(res, result);
  }
});

export default router;
