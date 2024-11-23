import { createLogger, format, transports } from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';


// Creating logger with weekly rotation
const logger = createLogger({
    level: 'info',
    format: format.combine(
        format.timestamp({
            format: 'YYYY-MM-DD HH:mm:ss'
        }),
        format.printf(({ timestamp, level, message }) => {
            return `${timestamp} - ${message}`;
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

// Export the logger
export default logger;