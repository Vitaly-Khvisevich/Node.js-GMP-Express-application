import {
  Entity, PrimaryGeneratedColumn, Column, OneToMany,
} from 'typeorm';
import { Cart } from './cart';
import { Order } from './order';

@Entity()
export class User {
    @PrimaryGeneratedColumn('uuid')
      _id!: string;

    @Column({ type: 'varchar', unique: true })
      email!: string;

    @Column()
      password!: string;

    @Column()
      role!: string;

    @OneToMany(() => Cart, (cart) => cart.user)
      cart: Cart[] | undefined;

    @OneToMany(() => Order, (order) => order.user)
      orders: Order[] | undefined;
}
