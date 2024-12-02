import { DataSource, DataSourceOptions } from 'typeorm';
import { SeederOptions } from 'typeorm-extension';
import { join } from 'path';
import MainSeeder from './seeds/main.seeder';
import { UsersFactory } from './factories/users.factory';
import { ProductsFactory } from './factories/products.factory';
import { CartsFactory } from './factories/cart.factory';
import 'dotenv/config';

const options: DataSourceOptions & SeederOptions = {
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  schema: 'public',
  entities: [join(__dirname, './models/*.ts').replace(/\\/g, '/')],
  migrations: [join(__dirname, './migrations/*.ts').replace(/\\/g, '/')],
  logging: true,
  synchronize: false,
  cache: false,
  factories: [UsersFactory, ProductsFactory, CartsFactory],
  seeds: [MainSeeder],
};

export const myDataSource = new DataSource(options);
