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
            return `${timestamp} | ${level} | ${userInfo} | ${message}`;
        }
    )),
    transports: [
        new DailyRotateFile({
            filename: 'logs/%DATE%.log',
            datePattern: 'YYYY-[W]WW',
            maxSize: '20m',
            maxFiles: '4w',
        }),
    ],
});

// Custom logging methods
const logInfo = (message, user) => {
    logger.log('info', message, user);
}

const logError = (message, user) => {
    logger.log('error', message, user);
}

const logWarn = (message, user) => {
    logger.log('warn', message, user);
}


// Export the logger
export default logger;
// Export the custom logging methods
export { logInfo, logError, logWarn };