import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const { MONGO_URL, MONGO_URL_TEST, NODE_ENV } = process.env;
const connectDb = () => {
  mongoose
    .connect(NODE_ENV === 'test' ? MONGO_URL_TEST : MONGO_URL, {
      useCreateIndex: true,
      useUnifiedTopology: true,
      useNewUrlParser: true,
    })
    .then(console.log('connected to database'));
};

export default connectDb;
