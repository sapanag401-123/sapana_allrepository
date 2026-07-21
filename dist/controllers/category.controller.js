"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.remove = exports.update = exports.create = exports.getById = exports.getAll = void 0;
const category_model_1 = __importDefault(require("../models/category.model"));
const catchAsync_utils_1 = require("../utils/catchAsync.utils");
const cloudinary_utils_1 = require("../utils/cloudinary.utils");
const appError_utils_1 = __importDefault(require("../utils/appError.utils"));
const sendResponse_utils_1 = require("../utils/sendResponse.utils");
const pagination_utils_1 = require("../utils/pagination.utils");
const uploadFolder = "/categories";
//* get all -> sapana
//* Get all categories
exports.getAll = (0, catchAsync_utils_1.catchAsync)(async (req, res, next) => {
    const { query, order = "DESC", sortBy = "createdAt", page = 1, limit = 10, } = req.query;
    const currentPage = Number(page);
    const perPage = Number(limit);
    const skip = (currentPage - 1) * perPage;
    const filter = {};
    if (query) {
        filter.$or = [
            {
                name: {
                    $regex: query,
                    $options: "i",
                },
            },
            {
                description: {
                    $regex: query,
                    $options: "i",
                },
            },
        ];
    }
    const categories = await category_model_1.default.find(filter)
        .limit(perPage)
        .skip(skip)
        .sort({
        [sortBy]: order === "DESC" ? -1 : 1,
    });
    const totalCount = await category_model_1.default.countDocuments(filter);
    (0, sendResponse_utils_1.sendResponse)(res, {
        message: "Categories fetched successfully",
        data: {
            categories,
            pagination: (0, pagination_utils_1.getPagination)({
                totalCount,
                perPage,
                currentPage,
            }),
        },
        statusCode: 200,
    });
});
//* get by id -> rubina
//* Get category by ID
exports.getById = (0, catchAsync_utils_1.catchAsync)(async (req, res, next) => {
    const { id } = req.params;
    const category = await category_model_1.default.findById(id);
    if (!category) {
        throw new appError_utils_1.default("Category not found", 404);
    }
    res.status(200).json({
        success: true,
        message: "Category fetched successfully",
        data: category,
    });
});
//* create -> ashmita e
//* Create category
exports.create = (0, catchAsync_utils_1.catchAsync)(async (req, res, next) => {
    const { name, description } = req.body;
    const file = req.file;
    if (!name)
        throw new appError_utils_1.default("Name is required", 400);
    if (!file)
        throw new appError_utils_1.default("Logo is required", 400);
    const existingCategory = await category_model_1.default.findOne({ name });
    if (existingCategory) {
        throw new appError_utils_1.default("Category already exists", 400);
    }
    const { path, public_id } = await (0, cloudinary_utils_1.upload)(file, uploadFolder);
    const category = new category_model_1.default({
        name,
        description,
        logo: {
            path,
            public_id,
        },
    });
    await category.save();
    res.status(201).json({
        success: true,
        message: "Category created successfully",
        data: category,
    });
});
//* update -> atit
//* Update category
exports.update = (0, catchAsync_utils_1.catchAsync)(async (req, res, next) => {
    const { id } = req.params;
    const { name, description } = req.body;
    const file = req.file;
    const existingCategory = await category_model_1.default.findById(id);
    if (!existingCategory) {
        throw new appError_utils_1.default("Category does not exist", 404);
    }
    const updateData = {
        name,
        description,
    };
    // If new logo is uploaded
    if (file) {
        const { path, public_id } = await (0, cloudinary_utils_1.upload)(file, uploadFolder);
        updateData.logo = {
            path,
            public_id,
        };
    }
    const updatedCategory = await category_model_1.default.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
    res.status(200).json({
        success: true,
        message: "Category updated successfully",
        data: updatedCategory,
    });
});
//* delete -> shristi 
//* Delete category
exports.remove = (0, catchAsync_utils_1.catchAsync)(async (req, res, next) => {
    const { id } = req.params;
    const category = await category_model_1.default.findByIdAndDelete(id);
    if (!category) {
        throw new appError_utils_1.default("Category not found", 404);
    }
    res.status(200).json({
        success: true,
        message: "Category deleted successfully",
        data: null,
    });
});
