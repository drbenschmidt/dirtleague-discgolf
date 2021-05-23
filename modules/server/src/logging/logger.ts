import winston, { LoggerOptions } from 'winston';
import type { Logger } from 'winston';

let logger: Logger = null;
let clientLogger: Logger = null;

export const createLogger = (options?: LoggerOptions): Logger => {
  return winston.createLogger(options);
};

const getLevel = () => {
  const env = process.env.NODE_ENV || 'development';
  const isDevelopment = env === 'development';
  return isDevelopment ? 'debug' : 'warn';
};

export const getLogger = (): Logger => {
  if (!logger) {
    logger = createLogger({
      level: getLevel(),
      format: winston.format.json(),
      transports: [
        new winston.transports.File({
          filename: './logs/error.log',
          level: 'error',
        }),
        new winston.transports.File({ filename: './logs/all.log' }),
        new winston.transports.File({
          filename: '.logs/simple.log',
          format: winston.format.simple(),
        }),
      ],
    });

    if (process.env.NODE_ENV !== 'production') {
      logger.add(
        new winston.transports.Console({
          format: winston.format.simple(),
        })
      );
    }
  }

  return logger;
};

export const getClientLogger = (): Logger => {
  if (!clientLogger) {
    clientLogger = createLogger({
      level: getLevel(),
      format: winston.format.json(),
      transports: [
        new winston.transports.File({
          filename: './logs/client/error.log',
          level: 'error',
        }),
      ],
    });

    if (process.env.NODE_ENV !== 'production') {
      clientLogger.add(
        new winston.transports.Console({
          format: winston.format.simple(),
        })
      );
    }
  }

  return clientLogger;
};
