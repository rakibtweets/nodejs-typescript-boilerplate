import { beforeAll, afterAll } from '@jest/globals';
import mongoose from 'mongoose';
import { connectWithMongoDb, disconnectWithMongoDb } from '../src/libraries/db';

beforeAll(async () => {
  await connectWithMongoDb();
});

afterAll(async () => {
  await disconnectWithMongoDb();
});

describe('Mongoose connection', () => {
  it('should be open', () => {
    expect(mongoose.connection.readyState).toBe(1);
  });
});
