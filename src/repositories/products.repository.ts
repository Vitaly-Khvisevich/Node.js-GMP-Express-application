import { Product } from '../models/product';
import { myDataSource } from '../data-source';
import { logger } from '../logger';

export async function getProductById(id: string) {
  let findProduct;
  try {
    const product = await myDataSource.getRepository(Product).findOneBy({ _id: id });
    findProduct = product;
  } catch (err: unknown) {
    logger.error(err);
  }
  return findProduct;
}

export async function getAllProducts() {
  let products;
  try {
    const allProducts = await myDataSource.getRepository(Product).find();
    products = allProducts;
  } catch (err: unknown) {
    logger.error(err);
  }
  return products;
}
