"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.getById = exports.getAllAdmins = exports.getAll = void 0;
const user_model_1 = __importDefault(require("../models/user.model"));
const appError_utils_1 = __importDefault(require("../utils/appError.utils"));
const catchAsync_utils_1 = require("../utils/catchAsync.utils");
const enum_types_1 = require("../types/enum.types");
//! get all users
const getAll = async (req, res, next) => {
    try {
        //* find all users
        const users = await user_model_1.default.find({ role: enum_types_1.Role.USER });
        //* send success response
        res.status(200).json({
            message: "All users fetched",
            status: "success",
            success: true,
            data: users,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getAll = getAll;
//! get all admins
const getAllAdmins = async (req, res, next) => {
    try {
        //* find all users
        const admins = await user_model_1.default.find({
            role: {
                $in: [enum_types_1.Role.ADMIN, enum_types_1.Role.SUPER_ADMIN],
            },
        });
        //* send success response
        res.status(200).json({
            message: "All users fetched",
            status: "success",
            success: true,
            data: admins,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getAllAdmins = getAllAdmins;
//! get user by id
const getById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const user = await user_model_1.default.findOne({ _id: id });
        if (!user) {
            throw new appError_utils_1.default("user not found", 404);
        }
        res.status(200).json({
            message: `user: ${id} fetched`,
            success: true,
            status: "success",
            data: user,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getById = getById;
//* delete user  -> pramod
//? ready to make changed on this task
//! delete users
exports.deleteUser = (0, catchAsync_utils_1.catchAsync)(async (req, res, next) => {
    const user = await user_model_1.default.findByIdAndDelete(req.params.id);
    if (!user) {
        return next(new appError_utils_1.default(" user not found", 404));
    }
    res.status(200).json({
        success: true,
        message: "User deleted successfully",
        status: "success",
    });
});
