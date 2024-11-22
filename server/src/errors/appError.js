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
            detail: this.detail,
            extra: this.extra
        };
    }
}

export default AppError;