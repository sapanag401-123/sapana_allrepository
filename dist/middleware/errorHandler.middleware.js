"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const jsonwebtoken_1 = require("jsonwebtoken");
const errorHandler = (error, req, res, next) => {
    // console.log(error);
    let message = error?.message ?? "Internal server error";
    let status = error?.status ?? "error";
    let statusCode = error?.statusCode ?? 500;
    const success = false;
    if (error?.cause?.code === 11000) {
        statusCode = 400;
        status = "fail";
    }
    if (error instanceof jsonwebtoken_1.JsonWebTokenError) {
        message = "Invalid token.Login required";
        statusCode = 401;
    }
    if (error instanceof jsonwebtoken_1.TokenExpiredError) {
        message = "Token expired.Login required";
        statusCode = 401;
    }
    res.status(statusCode).json({
        message,
        success,
        status,
        data: null,
        details: error?.errors ?? null,
        original_error: error?.stack,
    });
};
exports.errorHandler = errorHandler;
