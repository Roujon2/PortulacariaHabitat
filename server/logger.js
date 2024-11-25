import { createLogger, format, transports } from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';


// Creating logger with weekly rotation
const logger = createLogger({
    level: 'info',
    format: format.combine(
        format.timestamp({
            format: 'YYYY-MM-DD HH:mm:ss'
        }),
        format.printf(({ timestamp, level, message, user }) => {
            const userInfo = user ? 'User: ' + JSON.stringify(user) : 'User: N/A';
            return `${timestamp} | ${level} | ${message} | ${userInfo}`;
        }
    )),
    transports: [
        new DailyRotateFile({
            filename: 'logs/%DATE%.log',
            datePattern: 'YYYY-MM-DD',
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

const logError = (message, user) => {
    logger.log(
        {
            level: 'error',
            message: message,
            user: user
        }
    );
}

const logWarn = (message, user) => {
    logger.log(
        {
            level: 'warn',
            message: message,
            user: user
        }
    );
}


// Export the logger
export default logger;
// Export the custom logging methods
export { logInfo, logError, logWarn };