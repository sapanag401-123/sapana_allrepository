class appError extends Error {
    isOperation: boolean;
    status: "error" | "fail";
    constructor(
        public message: string,
        public statusCode: number,
    ){
        super(message);
        this.statusCode = statusCode;
        this.status  = statusCode >= 400 && statusCode < 500 ? "fail": "error";
        this.isOperation = true;
        Error.captureStackTrace(this, appError);
    }
}
export default appError;