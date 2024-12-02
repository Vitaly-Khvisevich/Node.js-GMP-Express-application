import crypto from 'crypto';
import * as cartRepository from '../repositories/carts.repository';
import * as cartType from '../schemas/cart.entity';
import * as orderType from '../schemas/order.entity';
import * as productType from '../schemas/product.entity';
import * as productsRepository from '../repositories/products.repository';
import * as orderRepository from '../repositories/orders.repository';
import { createBodyOfResponse } from '../utils/helper.util';

function createAnswerFromFullCart(fullCart:cartType.CartEntityFromDB) {
  const fullAnswer = { Code: 200, answerData: {} };
  const answer = {
    data:
    {
      cart: { id: '', items: [] as cartType.CartItemEntity[] } as cartType.CartForAnswer,
      total: 0,
    },
    error: null,
  };
  let total = 0;
  const { quantities } = fullCart;
  answer.data.cart.id = String(fullCart._id);
  fullCart.products.forEach((item) => {
    const countOfProduct = quantities[item._id];
    answer.data.cart.items.push({
      product: item,
      count: countOfProduct,
    });
    const priceOfProduct = Number(item.price);
    total += (priceOfProduct * countOfProduct);
  });
  answer.data.total = total;
  fullAnswer.answerData = answer;
  return fullAnswer;
}

async function _getFullCartAndCreateAnswer(email: string) {
  const cart = await cartRepository
    .getCartByUserEmail(email) as cartType.CartEntityFromDB | undefined;
  if (cart) {
    return createAnswerFromFullCart(cart);
  }
  return undefined;
}

function createOrder(userId: string, cartData:cartType.CartEntityFromDB, status: 'created' | 'completed') {
  const fullOrder = {
    Code: 200,
    answerData: {} as { data: { order: orderType.OrderEntity;};
    error: null;
  },
  };
  const answer = {
    data:
    {
      order:
       { userId: '', items: [] as cartType.CartItemEntity[] } as orderType.OrderEntity,
    },
    error: null,
  };
  let total = 0;

  answer.data.order._id = crypto.randomUUID();
  answer.data.order.userId = userId;
  answer.data.order.cartId = cartData._id;
  cartData.products.forEach((item) => {
    const countOfProduct = cartData.quantities[item._id];
    answer.data.order.items.push({ product: item, count: countOfProduct });
    const priceOfProduct = item.price;
    total += (priceOfProduct * countOfProduct);
  });
  answer.data.order.status = status;
  answer.data.order.total = total;
  fullOrder.answerData = answer;
  return fullOrder;
}

export async function getCartForUser(email: string) {
  const fullCart = await cartRepository
    .getCartByUserEmail(email) as cartType.CartEntityFromDB | undefined;
  let answerKart;
  if (fullCart) {
    answerKart = createAnswerFromFullCart(fullCart);
  } else {
    cartRepository.createNewCart(email);
    answerKart = _getFullCartAndCreateAnswer(email);
  }

  return answerKart;
}

export async function updateCartData(email:string, body: {productId:string, count:number}) {
  let answer;
  const fullCart = await cartRepository
    .getCartByUserEmail(email) as cartType.CartEntityFromDB | undefined;
  const { productId, count } = body;
  let currentProduct;
  if (fullCart) {
    fullCart.products.forEach((item) => {
      const product = item;
      if (String(product._id) === productId) {
        currentProduct = item;
      }
    });
    if (currentProduct) {
      if (count === 0) {
        const isDelete = await cartRepository.changeCountOrDeleteProduct('Delete', email, productId);
        if (isDelete) {
          answer = _getFullCartAndCreateAnswer(email);
        } else {
          answer = createBodyOfResponse(500, 'Internal Server error');
        }
      } else {
        const isChanged = await cartRepository.changeCountOrDeleteProduct('CountChange', email, productId, count);
        if (isChanged) {
          answer = _getFullCartAndCreateAnswer(email);
        } else {
          answer = createBodyOfResponse(500, 'Internal Server error');
        }
      }
    } else {
      const findProduct = await productsRepository
        .getProductById(productId) as productType.dbProductEntity | undefined;
      if (findProduct && count > 0) {
        const isAdded = await cartRepository.addProductToCart(email, count, findProduct);
        if (isAdded) {
          answer = _getFullCartAndCreateAnswer(email);
        } else {
          answer = createBodyOfResponse(500, 'Internal Server error');
        }
      } else {
        answer = createBodyOfResponse(400, 'Products are not valid');
      }
    }
  } else {
    answer = createBodyOfResponse(404, 'Cart was not found');
  }
  return answer;
}

export async function deleteCart(userId:string) {
  let answer;
  const isDeleted = await cartRepository.deleteCart(userId);
  if (isDeleted) {
    answer = createBodyOfResponse(200, null, { success: true });
  } else {
    answer = createBodyOfResponse(500, 'Internal Server error');
  }
  return answer;
}

export async function createNewOrder(userId:string) {
  let answer;
  const fullCart = await cartRepository
    .getCartByUserEmail(userId) as cartType.CartEntityFromDB | undefined;
  if (fullCart) {
    if (fullCart.products.length === 0) {
      answer = createBodyOfResponse(400, 'Cart is empty');
    } else {
      answer = createOrder(userId, fullCart, 'created');
      orderRepository.addNewOrder(answer.answerData);
    }
  } else {
    answer = createBodyOfResponse(404, 'Cart was not found');
  }
  return answer;
}
