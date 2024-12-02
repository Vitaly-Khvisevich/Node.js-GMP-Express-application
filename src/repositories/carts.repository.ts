import { myDataSource } from '../data-source';
import * as cartType from '../schemas/cart.entity';
import * as productType from '../schemas/product.entity';
import { Cart } from '../models/cart';
import * as users from './users.repository';
import { logger } from '../logger';

export async function getCartByUserEmail(userEmail: string) {
  let foundCart;
  try {
    const findElement = await myDataSource.getRepository(Cart)
      .findOne({
        where: {
          isDeleted: false,
          user: { email: userEmail },
        },
        relations: ['user', 'products'],
      });
    foundCart = findElement;
  } catch (err: unknown) {
    logger.error(err);
  }
  return foundCart;
}

export async function deleteCart(userEmail:string) {
  let isDeleted = false;
  const cartForUpdate = await getCartByUserEmail(userEmail) as
  cartType.CartEntityFromDB | undefined;
  if (cartForUpdate) {
    try {
      myDataSource.getRepository(Cart).update(cartForUpdate._id, { isDeleted: true });
      isDeleted = true;
    } catch (err: unknown) {
      logger.error(err);
    }
  }
  return isDeleted;
}

export async function createNewCart(userEmail: string) {
  const userData = await users.findByEmail(userEmail);
  if (userData) {
    const emptyCart = new Cart();
    emptyCart.isDeleted = false;
    emptyCart.user = userData;
    emptyCart.products = [];
    emptyCart.quantities = {};
    try {
      myDataSource.getRepository(Cart).save(emptyCart);
    } catch (err: unknown) {
      logger.error(err);
    }
  } else {
    logger.error('Error with user finding');
  }
}

export async function addProductToCart(
  userEmail:string,
  count:number,
  product: productType.dbProductEntity,
) {
  let isAdded = false;
  const cartForUpdate = await getCartByUserEmail(userEmail) as
  cartType.CartEntityFromDB | undefined;
  if (cartForUpdate) {
    const itemsFromCart = cartForUpdate.products;
    const { quantities } = cartForUpdate;
    itemsFromCart.push(product);
    quantities[product._id] = count;
    try {
      cartForUpdate.quantities = quantities;
      cartForUpdate.products = itemsFromCart;
      myDataSource.getRepository(Cart).save(cartForUpdate);
      isAdded = true;
    } catch (err: unknown) {
      logger.error(err);
    }
  }
  return isAdded;
}

export async function changeCountOrDeleteProduct(
  action: string,
  userEmail:string,
  productId: string,
  count?:number,
) {
  let isChanged = false;
  const cartForUpdate = await getCartByUserEmail(userEmail) as
   cartType.CartEntityFromDB | undefined;
  if (cartForUpdate) {
    const { products } = cartForUpdate;
    for (let i = 0; i < products.length; i += 1) {
      const product = products[i];
      if (product._id === productId) {
        if (action === 'CountChange' && count) {
          cartForUpdate.quantities[productId] = count;
        } else {
          products.splice(i, 1);
          cartForUpdate.products = products;
        }
      }
    }
    try {
      myDataSource.getRepository(Cart).save(cartForUpdate);
      isChanged = true;
    } catch (err: unknown) {
      logger.error(err);
    }
  }
  return isChanged;
}
