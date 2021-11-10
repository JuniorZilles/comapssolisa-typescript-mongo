/* eslint-disable no-console */
/* eslint-disable class-methods-use-this */
import mongoose from 'mongoose';
import config from '../../config/config';

class MongoDatabase {
  async connect() {
    await mongoose.connect(`mongodb://${config.database.host}/${config.database.collection}`, {
      user: config.database.username,
      pass: config.database.password,
      authSource: 'admin'
    });
  }

  async disconect() {
    await mongoose.connection.close();
  }
}

export default new MongoDatabase();
