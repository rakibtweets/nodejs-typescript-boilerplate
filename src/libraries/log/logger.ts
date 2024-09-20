import { retrieveRequestId } from '../../middlewares/request-context';
import { createLogger, format, transports } from 'winston';
// eslint-disable-next-line @typescript-eslint/no-require-imports
require('winston-daily-rotate-file');

const LOG_DIR = 'logs';

class LogManager {
  private static instance: LogManager | undefined;
  private logger;

  private constructor() {
    this.logger = createLogger({
      level: 'info',
      format: format.combine(
        format.timestamp({
          format: 'YYYY-MM-DD HH:mm:ss'
        }),
        format.errors({ stack: true }),
        format.splat(),
        format.json(),
        format((info) => {
          const requestId = retrieveRequestId();
          if (requestId) {
            info.requestId = requestId;
          }
          return info;
        })()
      ),
      transports: [
        new transports.File({
          filename: `${LOG_DIR}/error.log`,
          level: 'error'
        }),
        new transports.File({ filename: `${LOG_DIR}/combined.log` }),
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore
        new transports.DailyRotateFile({
          level: 'info',
          filename: `${LOG_DIR}/application-%DATE%.log`,
          datePattern: 'YYYY-MM-DD-HH',
          zippedArchive: true,
          maxSize: '20m',
          maxFiles: '14d'
        })
      ]
    });

    if (process.env.NODE_ENV !== 'production') {
      this.logger.add(
        new transports.Console({
          format: format.combine(format.colorize(), format.simple())
        })
      );
    }
  }

  public getLogger() {
    return this.logger;
  }

  public static getInstance(): LogManager {
    if (!this.instance) {
      this.instance = new LogManager();
    }

    return this.instance;
  }
}

export default LogManager.getInstance().getLogger();
