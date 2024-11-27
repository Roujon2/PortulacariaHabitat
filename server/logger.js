import { createLogger, format, transports } from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';


// Creating logger with weekly rotation
const logger = createLogger({
    level: 'info',
    format: format.combine(
        format.timestamp({
            format: 'YYYY-MM-DD HH:mm:ss'
        }),
        format.printf(({ timestamp, level, message, user, metadata }) => {
            const userInfo = user ? 'User: ' + JSON.stringify(user) : 'User: N/A';
            return `${timestamp} | ${level} | ${message} | ${userInfo} | Metadata: ${metadata ? JSON.stringify(metadata) : 'Metadata: N/A'}`;
        }
    )),
    transports: [
        new DailyRotateFile({
            filename: 'logs/%DATE%.log',
            datePattern: 'DD-MM-YYYY',
            maxSize: '20m',
            maxFiles: '14d',
        }),
    ],
});

// Custom logging methods
const logInfo = (message, user) => {
    logger.log(
        {
            level: 'info',
            message: message,
            user: user
        }
    );
}

const logError = (message, user, metadata) => {
    logger.log(
        {
            level: 'error',
            message: message,
            user: user,
            metadata
        }
    );
}

const logWarn = (message, user, metadata) => {
    logger.log(
        {
            level: 'warn',
            message: message,
            user: user,
            metadata
        }
    );
}


// Export the logger
export default logger;
// Export the custom logging methods
export { logInfo, logError, logWarn };