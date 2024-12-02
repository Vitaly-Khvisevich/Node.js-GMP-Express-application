import * as productsRepository from '../repositories/products.repository';
import * as productType from '../schemas/product.entity';
import { createBodyOfResponse } from '../utils/helper.util';

export async function getProducts() {
  const productForm = { Code: 200, answerData: {} };
  const answer = { data: [] as productType.dbProductEntity[], error: null };
  const data = await productsRepository.getAllProducts() as productType.dbProductEntity[];
  if (data) {
    answer.data = data;
  }
  productForm.answerData = answer;
  return productForm;
}

export async function getProductById(id:string) {
  let productForm = { Code: 200, answerData: {} };
  const answer = { data: {} as productType.dbProductEntity, error: null };
  const product = await productsRepository.getProductById(id) as productType.dbProductEntity;
  if (product) {
    answer.data = product;
    productForm.answerData = answer;
  } else {
    productForm = createBodyOfResponse(404, 'No product with such id');
  }
  return productForm;
}
