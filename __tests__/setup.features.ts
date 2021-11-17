import MongoDatabase from '../src/infra/mongo/index';
import cleanDatabase from './utils/cleanDatabase';

global.beforeAll(async () => {
  await MongoDatabase.connect();
});

global.afterEach(async () => {
  await cleanDatabase();
});

global.afterAll(async () => {
  await MongoDatabase.disconect();
});
