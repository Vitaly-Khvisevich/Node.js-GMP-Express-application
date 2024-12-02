import {
  Entity, PrimaryGeneratedColumn, Column, JoinTable, ManyToOne, ManyToMany,
} from 'typeorm';
import { User } from './user';
import { Product } from './product';

@Entity()
export class Order {
    @PrimaryGeneratedColumn('uuid')
      _id!: string;

    @Column('timestamp', { default: () => 'CURRENT_TIMESTAMP' })
      orderDate!: Date;

    @ManyToOne(() => User, (user) => user.orders)
      user!: User;

    @ManyToMany(() => Product)
    @JoinTable()
      products: Product[] | undefined;

    @Column('simple-json')
      quantities: { [productId: string]: number; } | undefined;

    @Column({ type: 'varchar' })
      status: string | undefined;
}
