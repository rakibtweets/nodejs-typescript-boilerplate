import { MongoMemoryServer } from 'mongodb-memory-server';

export default async function globalSetup(): Promise<void> {
  const instance = await MongoMemoryServer.create({
    instance: {
      dbName: 'testdb',
      port: 27018
    }
  });
  global.__MONGOINSTANCE = instance;
}
