import 'dotenv/config';
import winston, { format, createLogger } from 'winston';

const myFormat = format.printf(({ level, meta, timestamp }) => `${timestamp} ${level}: ${meta}`);

export const logger = createLogger({
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({
      filename: './logs/logErrors.log',
      level: 'error',
    }),
    new winston.transports.File({
      filename: './logs/logInfos.log',
      level: 'info',
    }),
  ],
  format: format.combine(
    format.timestamp(),
    format.prettyPrint(),
  ),
});

const level = process.env.NODE_ENV === 'production' ? 'info' : 'debug';

export const userLogger = createLogger({

  level,
  format: winston.format.combine(
    winston.format.timestamp({ format: 'ddd, DD MMM YYYY HH:mm:ss' }),
    winston.format.printf((info) => `[${info.timestamp}] ${info.level.toUpperCase()} ${info.message}`),
  ),
  transports: [
    new winston.transports.File({
      filename: './logs/userRequestsData.log',
    }),
  ],
});
