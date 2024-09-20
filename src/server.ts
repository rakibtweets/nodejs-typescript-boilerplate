import config from './configs';
import express, { Application, Request, Response, NextFunction } from 'express';
import helmet from 'helmet';

import defineRoutes from './app';
import { errorHandler } from './libraries/error-handling';
import logger from './libraries/log/logger';
import { addRequestIdMiddleware } from './middlewares/request-context';
import { connectWithMongoDb } from './libraries/db';

let connection: any;

const createExpressApp = (): Application => {
  const expressApp = express();

  // Use middlewares
  expressApp.use(addRequestIdMiddleware);
  expressApp.use(helmet());
  expressApp.use(express.urlencoded({ extended: true }));
  expressApp.use(express.json());

  // Middleware to log an info message for each incoming request
  expressApp.use((req: Request, res: Response, next: NextFunction) => {
    logger.info(`${req.method} ${req.originalUrl}`);
    next();
  });

  logger.info('Express middlewares are set up');

  // Define routes
  defineRoutes(expressApp);

  // Error handling middleware
  defineErrorHandlingMiddleware(expressApp);

  return expressApp;
};

const startWebServer = async (): Promise<Application> => {
  logger.info('Starting web server...');

  // Create Express application
  const expressApp = createExpressApp();

  // Open connection (assuming openConnection returns an object with address and port)
  const APIAddress = await openConnection(expressApp);

  // Log server info
  logger.info(`Server is running on ${APIAddress.address}:${APIAddress.port}`);

  // Connect to MongoDB
  await connectWithMongoDb();

  return expressApp;
};

const stopWebServer = async (): Promise<void> => {
  return new Promise<void>((resolve) => {
    if (connection !== undefined) {
      connection.close(() => {
        resolve();
      });
    }
  });
};

const openConnection = async (
  expressApp: Application
): Promise<{ address: string | null; port: number }> => {
  return new Promise<{ address: string | null; port: number }>((resolve) => {
    const webServerPort = config.PORT;
    logger.info(`Server is about to listen to port ${webServerPort}`);

    connection = expressApp.listen(webServerPort, () => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
      errorHandler.listenToErrorEvents(connection);
      const addressInfo = connection.address();
      if (typeof addressInfo === 'string') {
        resolve({ address: addressInfo, port: webServerPort });
      } else if (addressInfo && 'port' in addressInfo) {
        resolve({ address: addressInfo.address, port: addressInfo.port });
      } else {
        resolve({ address: null, port: webServerPort });
      }
    });
  });
};

const defineErrorHandlingMiddleware = (expressApp: Application): void => {
  expressApp.use(async (error: any, req: Request, res: Response) => {
    // Ensure next is included for Express error handlers
    if (error && typeof error === 'object') {
      if (error.isTrusted === undefined || error.isTrusted === null) {
        error.isTrusted = true;
      }
    }

    // Handle error and send response
    errorHandler.handleError(error);
    res.status(error?.HTTPStatus || 500).end();
  });
};

export { createExpressApp, startWebServer, stopWebServer };
