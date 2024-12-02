import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Product {
    @PrimaryGeneratedColumn('uuid')
      _id!: string;

    @Column()
      title!: string;

    @Column('text')
      description: string | undefined;

    @Column('decimal', { precision: 10, scale: 2 })
      price!: number;
}
