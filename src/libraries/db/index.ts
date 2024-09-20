import mongoose from 'mongoose';
import logger from '../log/logger';
import config from '../../configs';

const connectWithMongoDb = async (): Promise<void> => {
  const MONGODB_URI = config.MONGODB_URI as string;

  logger.info('Connecting to MongoDB...');

  mongoose.connection.once('open', () => {
    logger.info('MongoDB connection is open');
  });

  mongoose.connection.on('error', (error: Error) => {
    logger.error('MongoDB connection error', error);
  });

  await mongoose.connect(MONGODB_URI, {
    autoIndex: true,
    autoCreate: true
  });

  logger.info('Connected to MongoDB');
};

const disconnectWithMongoDb = async (): Promise<void> => {
  logger.info('Disconnecting from MongoDB...');
  await mongoose.disconnect();
  logger.info('Disconnected from MongoDB');
};

export { connectWithMongoDb, disconnectWithMongoDb };
