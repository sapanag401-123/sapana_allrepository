"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.remove = exports.update = exports.getById = exports.getAll = exports.create = void 0;
const brand_model_1 = __importDefault(require("../models/brand.model"));
const appError_utils_1 = __importDefault(require("../utils/appError.utils"));
const catchAsync_utils_1 = require("../utils/catchAsync.utils");
const cloudinary_utils_1 = require("../utils/cloudinary.utils");
const sendResponse_utils_1 = require("../utils/sendResponse.utils");
const pagination_utils_1 = require("../utils/pagination.utils");
const uploadFolder = "/brands";
// Create Brand
exports.create = (0, catchAsync_utils_1.catchAsync)(async (req, res) => {
    const { name, description } = req.body;
    // req.file / files
    const file = req.file;
    if (!name) {
        throw new appError_utils_1.default("name required.", 400);
    }
    if (!file) {
        throw new appError_utils_1.default("logo is required.", 400);
    }
    const existingBrand = await brand_model_1.default.findOne({ name });
    if (existingBrand) {
        throw new appError_utils_1.default("Brand already exists.", 400);
    }
    const brand = new brand_model_1.default({
        name,
        description,
    });
    const { path, public_id } = await (0, cloudinary_utils_1.upload)(file, uploadFolder);
    //profile_image = {path:'',public_id:''}
    // profile_image = ''
    brand.logo = {
        path,
        public_id,
    };
    // * handle logo upload
    //* save brand
    await brand.save();
    res.status(201).json({
        success: true,
        message: "Brand created successfully.",
        data: brand,
    });
});
// Get All Brands
//total 100
//page 1 limit:10   skip:0  ->10  id 1-10
//page 2 limit:10  skip: 10 ->10  id 11-20
//page 3 limit:10  skip: 10 ->20  id 21-30
//page 4 limit:10  skip: 10 ->30  id 31-40
exports.getAll = (0, catchAsync_utils_1.catchAsync)(async (req, res, next) => {
    //filter
    const { query, order = "DESC", sortBy = "createdAt", page = 1, limit = 10, } = req.query;
    const currentPage = Number(page);
    const perPage = Number(limit);
    const skip = (currentPage - 1) * perPage;
    const filter = {};
    if (query) {
        // filter.name = {
        // $regex: query,
        // $options: "i",
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
    const brands = await brand_model_1.default.find(filter)
        .limit(perPage)
        .skip(skip)
        .sort({
        [sortBy]: order === "DESC" ? -1 : 1,
    });
    const totalCount = await brand_model_1.default.countDocuments(filter);
    (0, sendResponse_utils_1.sendResponse)(res, {
        message: "Brands fetched",
        data: {
            brands,
            pagination: (0, pagination_utils_1.getPagination)({
                totalCount,
                perPage,
                currentPage,
            }),
        },
        statusCode: 200,
    });
});
// test
// Get Brand By ID
exports.getById = (0, catchAsync_utils_1.catchAsync)(async (req, res, next) => {
    const brand = await brand_model_1.default.findById(req.params.id);
    if (!brand) {
        throw new appError_utils_1.default("Brand not found.", 404);
    }
    res.status(200).json({
        message: `brand by id:${req.params.id} fetched`,
        success: true,
        data: brand,
    });
});
// Update Brand
exports.update = (0, catchAsync_utils_1.catchAsync)(async (req, res, next) => {
    const brand = await brand_model_1.default.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    });
    if (!brand) {
        return next(new appError_utils_1.default("Brand not found.", 404));
    }
    res.status(200).json({
        success: true,
        message: "Brand updated successfully.",
        data: brand,
    });
});
// Delete Brand
exports.remove = (0, catchAsync_utils_1.catchAsync)(async (req, res, next) => {
    const brand = await brand_model_1.default.findByIdAndDelete(req.params.id);
    if (!brand) {
        return next(new appError_utils_1.default("Brand not found.", 404));
    }
    res.status(200).json({
        success: true,
        message: "Brand deleted successfully.",
    });
});
