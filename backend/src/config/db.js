import mongoose from 'mongoose';

require('dotenv').config({
  path: process.env.NODE_ENV ==='test' ? '.env.test' : '.env'
});

const connectToDb = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('CONNECTED TO MONGODB');
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

export default connectToDb;
