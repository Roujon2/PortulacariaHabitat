// Custom app error for internal server errors
class AppError extends Error {
    constructor(message, statusCode, extra = null, success = false) {
        super(message);
        this.statusCode = statusCode;
        this.extra = extra;
        //Error.captureStackTrace(this, this.constructor);
    }

    toJSON() {
        return {
            message: this.message,
            statusCode: this.statusCode,
            extra: this.extra,
            success: this.success
        };
    }

    // Console log the error
    toLog() {
        // Unpack extra in error if it exists
        if (this.extra) {
            return `Error: ${this.message} | Status Code: ${this.statusCode} | Extra: ${JSON.stringify(this.extra)}`;
        } else {
            return `Error: ${this.message} | Status Code: ${this.statusCode}`;
        }
    }
}

export default AppError;