import {
  Entity, PrimaryGeneratedColumn, Column, JoinColumn, ManyToMany, JoinTable, ManyToOne,
} from 'typeorm';
import { User } from './user';
import { Product } from './product';

@Entity()
export class Cart {
  @PrimaryGeneratedColumn('uuid')
    _id!: string;

  @Column({ default: false })
    isDeleted!: boolean;

  @ManyToOne(() => User, (user) => user.cart)
  @JoinColumn()
    user!: User;

  @ManyToMany(() => Product)
  @JoinTable()
    products!: Product[];

  @Column('simple-json')
    quantities!: { [productId: string]: number; };
}
