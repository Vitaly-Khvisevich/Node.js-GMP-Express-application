import { setSeederFactory } from 'typeorm-extension';
import { Cart } from '../models/cart';

export const CartsFactory = setSeederFactory(Cart, async () => {
  const cart = new Cart();
  cart._id = '7fa46736-ffa2-4f53-944a-befde2632d82';
  cart.isDeleted = false;
  return cart;
});
