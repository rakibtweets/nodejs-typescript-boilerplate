import logger from '../log/logger';
import { inspect } from 'util';
import { AppError } from './AppError';
import { Server } from 'http';

let httpServerRef: Server | null;

const errorHandler = {
  listenToErrorEvents: (): void => {
    process.on('uncaughtException', async (error: unknown) => {
      await errorHandler.handleError(error);
    });

    process.on('unhandledRejection', async (reason: unknown) => {
      await errorHandler.handleError(reason);
    });

    process.on('SIGTERM', async () => {
      logger.error(
        'App received SIGTERM event, try to gracefully close the server'
      );
      await terminateHttpServerAndExit();
    });

    process.on('SIGINT', async () => {
      logger.error(
        'App received SIGINT event, try to gracefully close the server'
      );
      await terminateHttpServerAndExit();
    });
  },

  handleError: async (errorToHandle: unknown): Promise<void> => {
    try {
      const appError: AppError = normalizeError(errorToHandle);
      logger.error(appError.message, appError);

      if (!appError.isTrusted) {
        await terminateHttpServerAndExit();
      }
    } catch (handlingError) {
      // No logger here since it might have failed
      process.stdout.write(
        'The error handler failed. Here are the handler failure and then the origin error that it tried to handle: '
      );
      process.stdout.write(JSON.stringify(handlingError));
      process.stdout.write(JSON.stringify(errorToHandle));
    }
  }
};

const terminateHttpServerAndExit = async (): Promise<void> => {
  if (httpServerRef) {
    await new Promise<void>((resolve) => httpServerRef.close(() => resolve())); // Graceful shutdown
  }
  process.exit();
};

const normalizeError = (errorToHandle: unknown): AppError => {
  if (errorToHandle instanceof AppError) {
    return errorToHandle;
  }
  if (errorToHandle instanceof Error) {
    const appError = new AppError(errorToHandle.name, errorToHandle.message);
    appError.stack = errorToHandle.stack;
    return appError;
  }

  const inputType = typeof errorToHandle;
  return new AppError(
    'general-error',
    `Error Handler received a non-error instance with type - ${inputType}, value - ${inspect(
      errorToHandle
    )}`
  );
};

export { errorHandler };
