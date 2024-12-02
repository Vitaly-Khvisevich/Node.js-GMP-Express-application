import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { User } from '../models/user';
import { Product } from '../models/product';
import { Cart } from '../models/cart';

export default class MainSeeder implements Seeder {
  // eslint-disable-next-line class-methods-use-this
  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<void> {
    const cartsRepository = dataSource.getRepository(Cart);

    const userFactory = factoryManager.get(User);
    const productFactory = factoryManager.get(Product);
    const cartFactory = factoryManager.get(Cart);

    const users = await userFactory.saveMany(1);
    const product = await productFactory.saveMany(3);

    const fakeProduct = product[0];

    const cart = await cartFactory.make({
      user: users[0],
      products: [fakeProduct],
      quantities: { [fakeProduct._id]: 15 },
    });

    await cartsRepository.save(cart);
  }
}
