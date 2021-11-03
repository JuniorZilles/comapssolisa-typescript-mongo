/* eslint-disable no-console */
/* eslint-disable class-methods-use-this */
import mongoose from 'mongoose';
import config from '../../config/config';

class MongoDatabase {
  async connect() {
    await mongoose.connect(
      `mongodb://${config.database.host}/${config.database.collection}`,
      {
        user: config.database.username,
        pass: config.database.password,
        authSource: 'admin',
      },
    );

    mongoose.connection.on('open', () => {
      console.log('Connected to mongo');
    });

    mongoose.connection.on('error', (err:Error) => {
      console.log(err);
    });
  }

  async disconect() {
    await mongoose.connection.close();
  }
}

export default new MongoDatabase();
