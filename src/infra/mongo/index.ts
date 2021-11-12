/* eslint-disable class-methods-use-this */
import mongoose from 'mongoose';
import config from '../../config/config';

class MongoDatabase {
  async connect() {
    await mongoose.connect(config.database.host as string);
  }

  async disconect() {
    await mongoose.connection.close();
  }
}

export default new MongoDatabase();
