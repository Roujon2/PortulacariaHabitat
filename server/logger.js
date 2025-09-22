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
        // Info logs
        new DailyRotateFile({
            filename: 'logs/info-%DATE%.log',
            datePattern: 'DD-MM-YYYY',
            maxSize: '20m',
            maxFiles: '14d',
            level: 'info'
        }),
        // Warn logs
        new DailyRotateFile({
            filename: 'logs/warn-%DATE%.log',
            datePattern: 'DD-MM-YYYY',
            maxSize: '20m',
            maxFiles: '14d',
            level: 'warn'
        }),
        // Error logs
        new DailyRotateFile({
            filename: 'logs/error-%DATE%.log',
            datePattern: 'DD-MM-YYYY',
            maxSize: '20m',
            maxFiles: '14d',
            level: 'error'
        }),
        new transports.Console({
            format: format.combine(format.colorize(), format.simple()),
        }),
    ],
});

// Custom logging methods
const logInfo = (message, user) => {
    logger.info(
        {
            level: 'info',
            message: message,
            user: user
        }
    );
}

const logError = (message, user, metadata) => {
    logger.error(
        {
            level: 'error',
            message: message,
            user: user,
            metadata
        }
    );
}

const logWarn = (message, user, metadata) => {
    logger.warn(
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