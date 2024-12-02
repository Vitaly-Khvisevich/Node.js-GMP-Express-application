import * as faker from '@faker-js/faker';
import { setSeederFactory } from 'typeorm-extension';
import crypto from 'crypto';
import { Product } from '../models/product';

export const ProductsFactory = setSeederFactory(Product, async () => {
  const product = new Product();
  product._id = crypto.randomUUID() as string;
  product.title = faker.faker.food.dish();
  product.description = faker.faker.food.description();
  product.price = Number(faker.faker.commerce.price({ min: 100, max: 200, dec: 0 }));
  return product;
});
