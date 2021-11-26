import dotenv from 'dotenv';

dotenv.config({
  path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env'
});

export default {
  database: {
    host: process.env.MONGO_HOST,
    name: process.env.MONGO_DB_NAME
  },
  secret: process.env.SECRET,
  cepApi: process.env.CEPAPIURL
};
