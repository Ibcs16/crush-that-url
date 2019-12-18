import mongoose from 'mongoose';

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
