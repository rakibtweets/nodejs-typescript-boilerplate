import { startWebServer } from './server';

const start = async () => {
  await startWebServer();
};

start()
  .then(() => {
    console.log('Done');
  })
  .catch((error) => {
    console.error(error);
  });
