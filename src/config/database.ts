import mongoose from 'mongoose';

let database: mongoose.Connection;
const DATABASE_URI = 'mongodb://admin:admin@database:27017';

export const connectDatabase = () => {
  if (database) {
    return;
  }

  mongoose.connect(DATABASE_URI, {
    useNewUrlParser: true,
    useFindAndModify: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  });

  database = mongoose.connection;

  database.once('open', async () => {
    console.log('Successfully connection to Database');
  });

  database.on('error', () => {
    console.log('Error connecting to MongoDB database');
  });
};
export const disconnect = () => {
  if (!database) {
    return;
  }

  mongoose.disconnect();
};
