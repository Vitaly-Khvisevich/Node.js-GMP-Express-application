import * as orderType from '../schemas/order.entity';
import * as productType from '../schemas/product.entity';
import { Order } from '../models/order';
import { myDataSource } from '../data-source';
import * as users from './users.repository';

type OrderInput = {
  data: {
    order: orderType.OrderEntity;
  };
  error: null;
};

export async function addNewOrder(order: OrderInput) {
  try {
    const userData = await users.findByEmail(order.data.order.userId);
    const products = [] as productType.dbProductEntity[];
    const quantities = {} as { [productId: string]: number; };
    order.data.order.items.forEach((product) => {
      const productId = product.product._id;
      products.push(product.product);
      quantities[productId] = product.count;
    });

    if (userData) {
      const newOrder = new Order();
      newOrder._id = order.data.order._id;
      newOrder.products = products;
      newOrder.user = userData;
      newOrder.quantities = quantities;
      newOrder.status = order.data.order.status;
      myDataSource.getRepository(Order).save(newOrder);
    }
  } catch (error) {
    console.error(new Error(`Failed to save order: ${(error as Error).message}`));
  }
}
