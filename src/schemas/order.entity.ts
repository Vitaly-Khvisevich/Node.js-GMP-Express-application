import { CartItemEntity } from './cart.entity';

type ORDER_STATUS = 'created' | 'completed';

export interface OrderEntity {
  _id: string, // uuid
  userId: string;
  cartId: string;
  items: CartItemEntity[] // products from CartEntity
  status: ORDER_STATUS;
  total: number;
}
