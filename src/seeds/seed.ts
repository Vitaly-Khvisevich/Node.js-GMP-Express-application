import { runSeeders } from 'typeorm-extension';
import { myDataSource } from '../data-source';

myDataSource.initialize().then(async () => {
  await runSeeders(myDataSource);
  process.exit();
});
