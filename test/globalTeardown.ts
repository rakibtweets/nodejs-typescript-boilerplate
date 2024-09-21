export default async function globalTeardown(): Promise<void> {
  const instance = global.__MONGOINSTANCE as any;
  await instance.stop();
}
