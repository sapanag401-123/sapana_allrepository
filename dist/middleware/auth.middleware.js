"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = void 0;
const appError_utils_1 = __importDefault(require("../utils/appError.utils"));
const jwt_utils_1 = require("../utils/jwt.utils");
const env_config_1 = __importDefault(require("../config/env.config"));
//* 1. login
//* 2. authorized ?
const authenticate = (roles) => {
    return (req, res, next) => {
        try {
            // Authorization header  / cookies
            //* 1. get access_token
            const cookies = req.cookies;
            const access_token = cookies["access_token"];
            if (!access_token) {
                throw new appError_utils_1.default("Unauthorized.Login required.", 401);
            }
            //* 2. verify access token
            const decoded_data = (0, jwt_utils_1.verifyJwtToken)(access_token);
            if (!decoded_data) {
                throw new appError_utils_1.default("Invalid token.Login required.", 401);
            }
            //* 3. check token expiry
            if (decoded_data.exp * 1000 <= Date.now()) {
                //* clear cookie
                res.clearCookie("access_token", {
                    httpOnly: env_config_1.default.NODE_ENV === "development" ? false : true,
                    secure: env_config_1.default.NODE_ENV === "development" ? false : true,
                    maxAge: Date.now(),
                    sameSite: env_config_1.default.NODE_ENV === "development" ? "lax" : "none",
                });
                throw new appError_utils_1.default("Token expired.Access denied.", 401);
            }
            //* 4.check role
            if (roles && roles.length > 0 && !roles.includes(decoded_data.role)) {
                throw new appError_utils_1.default("Unauthorized.Access denied.", 403);
            }
            req.user = {
                _id: decoded_data._id,
                email: decoded_data.email,
                role: decoded_data.role,
            };
            next();
        }
        catch (error) {
            next(error);
        }
    };
};
exports.authenticate = authenticate;
//add product model
