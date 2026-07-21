"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.changeProfileImage = exports.login = exports.register = void 0;
const user_model_1 = __importDefault(require("../models/user.model"));
const bcrypt_utils_1 = require("../utils/bcrypt.utils");
const appError_utils_1 = __importDefault(require("../utils/appError.utils"));
const catchAsync_utils_1 = require("../utils/catchAsync.utils");
const cloudinary_utils_1 = require("../utils/cloudinary.utils");
const jwt_utils_1 = require("../utils/jwt.utils");
const env_config_1 = __importDefault(require("../config/env.config"));
const sendResponse_utils_1 = require("../utils/sendResponse.utils");
const emailServer_utils_1 = require("../utils/emailServer.utils");
const emailTemplate_utils_1 = require("../utils/emailTemplate.utils");
const uploadFolder = "/profile_images";
//* register
exports.register = (0, catchAsync_utils_1.catchAsync)(async (req, res, next) => {
    //* body
    const { full_name, email, password, phone } = req.body;
    const file = req.file;
    const user = new user_model_1.default({ email, full_name, phone });
    //* hash password
    const hashPass = await (0, bcrypt_utils_1.hashPassword)(password);
    user.password = hashPass;
    //* handle profile image upload
    if (file) {
        //* upload to cloudinary
        const { path, public_id } = await (0, cloudinary_utils_1.upload)(file, uploadFolder);
        //profile_image = {path:'',public_id:''}
        // profile_image = ''
        user.profile_image = {
            path,
            public_id,
        };
    }
    //! save user
    await user.save();
    //* send account created email
    (0, emailServer_utils_1.sendEmail)({
        to: user.email,
        subject: "Account created",
        html: (0, emailTemplate_utils_1.accountCreatedHtml)({
            full_name: user.full_name,
            email: user.email,
            createdAt: user.createdAt,
        }),
    });
    //* converting mongoose doc to js object
    const { password: user_pass, ...rest } = user.toObject();
    //* success response
    (0, sendResponse_utils_1.sendResponse)(res, {
        message: "Account created",
        statusCode: 201,
        data: rest,
    });
});
//* login
exports.login = (0, catchAsync_utils_1.catchAsync)(async (req, res, next) => {
    // email , password
    const { email, password } = req.body;
    if (!email) {
        throw new appError_utils_1.default("email is required", 400);
    }
    if (!password) {
        throw new appError_utils_1.default("password is required", 400);
    }
    //* find user by email
    const user = await user_model_1.default.findOne({ email: email }).select("+password");
    if (!user) {
        throw new appError_utils_1.default("credentials does not matched", 400);
    }
    //* compare password
    const isPassMatched = await (0, bcrypt_utils_1.comparePassword)(password, user.password);
    if (!isPassMatched) {
        throw new appError_utils_1.default("credentials does not matched", 400);
    }
    //* send login detected email
    (0, emailServer_utils_1.sendEmail)({
        to: user.email,
        subject: "Login Detected",
        html: (0, emailTemplate_utils_1.newLoginDetectedHtml)({
            full_name: user.full_name,
            email: user.email,
            loginTime: new Date(Date.now()),
            device: req.headers["user-agent"],
        }),
    });
    //* generate jwt token
    const payload = {
        _id: user._id,
        email: user.email,
        role: user.role,
    };
    const access_token = (0, jwt_utils_1.generateJwtToken)(payload);
    res.cookie("access_token", access_token, {
        httpOnly: env_config_1.default.NODE_ENV === "development" ? false : true,
        secure: env_config_1.default.NODE_ENV === "development" ? false : true,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        sameSite: env_config_1.default.NODE_ENV === "development" ? "lax" : "none",
    });
    const { password: p, ...rest } = user.toObject();
    //* send success response
    (0, sendResponse_utils_1.sendResponse)(res, {
        message: "Login success",
        statusCode: 201,
        data: {
            user: rest,
            access_token,
        },
    });
});
//* logout
//* get profile
//* change profile image
exports.changeProfileImage = (0, catchAsync_utils_1.catchAsync)(async (req, res) => {
    const { _id } = req.user;
    const file = req.file;
    if (!file) {
        throw new appError_utils_1.default("profile image is required", 400);
    }
    const user = await user_model_1.default.findOne({ _id: _id });
    if (!user) {
        throw new appError_utils_1.default("Profile not found", 400);
    }
    //! delete old image
    if (user.profile_image && user.profile_image?.public_id) {
        await (0, cloudinary_utils_1.deleteFile)(user.profile_image.public_id);
    }
    const { path, public_id } = await (0, cloudinary_utils_1.upload)(file, uploadFolder);
    user.profile_image = {
        path,
        public_id,
    };
    //* send success response
    (0, sendResponse_utils_1.sendResponse)(res, {
        message: "Profile updated",
        statusCode: 200,
        data: user,
    });
});
//* change password
//* forgot password
//* change email
