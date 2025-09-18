// Base exception class
export class FragolaCloudError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'FragolaError';
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, FragolaCloudError);
        }
    }
}
