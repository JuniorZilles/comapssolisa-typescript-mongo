/* eslint-disable class-methods-use-this */
import mongoose from 'mongoose';
import config from '../../config/config';

class MongoDatabase {
  async connect() {
    const db = mongoose.connect(config.database.host as string, { dbName: config.database.name as string });
    return db;
  }

  async disconect() {
    await mongoose.connection.close();
  }
}

export default new MongoDatabase();
