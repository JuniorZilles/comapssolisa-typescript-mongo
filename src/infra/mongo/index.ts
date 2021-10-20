import mongoose from 'mongoose';
import config from '../../config/config'

class DatabaseDatabase {
  constructor() {
    this.connect();
  }

  connect() {
    const uri = `mongodb://${config.database.username}:${config.database.password}@${config.database.host}/${config.database.collection}`;
    return mongoose.connect(uri);
  }
}

export default new DatabaseDatabase().connect();