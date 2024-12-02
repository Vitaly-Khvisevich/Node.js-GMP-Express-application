import { dbProductEntity } from './product.entity';

export interface CartItemEntity {
  product: dbProductEntity;
  count: number;
}

export interface CartEntity {
  _id: string;
  userId: string;
  isDeleted: boolean;
  items: CartItemEntity[];
}

export interface CartEntityFromDB {
  _id: string;
  isDeleted: boolean;
  user: object;
  quantities: { [productId: string]: number; }
  products: dbProductEntity[]
}

export interface CartForAnswer {
  id: string; // uuid
  items: CartItemEntity[];
}
