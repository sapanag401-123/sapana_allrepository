"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFeaturedProducts = exports.getNewArrivals = exports.getByBrand = exports.getByCategory = exports.update = exports.remove = exports.create = exports.getById = exports.getAll = void 0;
const product_model_1 = __importDefault(require("../models/product.model"));
const appError_utils_1 = __importDefault(require("../utils/appError.utils"));
const catchAsync_utils_1 = require("../utils/catchAsync.utils");
const category_model_1 = __importDefault(require("../models/category.model"));
const brand_model_1 = __importDefault(require("../models/brand.model"));
const cloudinary_utils_1 = require("../utils/cloudinary.utils");
const sendResponse_utils_1 = require("../utils/sendResponse.utils");
const pagination_utils_1 = require("../utils/pagination.utils");
const folder = "/products";
//* get all
exports.getAll = (0, catchAsync_utils_1.catchAsync)(async (req, res) => {
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
    const products = await product_model_1.default.find(filter)
        .limit(perPage)
        .skip(skip)
        .sort({
        [sortBy]: order === "DESC" ? -1 : 1,
    });
    const totalCount = await product_model_1.default.countDocuments(filter);
    (0, sendResponse_utils_1.sendResponse)(res, {
        message: "Products fetched",
        data: {
            products,
            pagination: (0, pagination_utils_1.getPagination)({
                totalCount,
                perPage,
                currentPage,
            }),
        },
        statusCode: 200,
    });
});
//   //filter
//     const { query, category, brand, maxPrice, minPrice } = req.query;
//     const filter: any = {};
//     if (query){
//       // filter.name = {
//         // $regex: query,
//         // $options: "i",
//         filter.$or = [
//           {
//             name: {
//              $regex: query,
//              $options: "i",
//             },
//           },
//           {
//             description:{
//               $regex: query,
//              $options: "i",
//             },
//           },
//         ];
//         }
// //category
// if (category) {
//   filter.category = Category;
// }
// //brand
// if (brand) {
//   filter.brand = brand;
// }
// //price range
// if(minPrice || maxPrice){
//   const low = Number(minPrice);
//   const high = Number(maxPrice);
//   if (low){
//     filter.price = {
//       $gte: low,
//     };
//   }
//   if (high){
//     filter.price = {
//       $gte: high,
//     };
//   }
//   if (low && high){
//     filter.price = {
//       $lte: Highlight,
//       $gte: low,
//     };
//   }
// }
// const products = await Product.find(filter);
// sendResponse(res, {
//       message: "products fetched",
//       data: products,
//       statusCode: 200,
//     });
//   },
// );
//* get by id
exports.getById = (0, catchAsync_utils_1.catchAsync)(async (req, res) => {
    const { id } = req.params;
    const product = await product_model_1.default.findOne({ _id: id });
    if (!product)
        throw new appError_utils_1.default(`product not found`, 404);
    (0, sendResponse_utils_1.sendResponse)(res, {
        data: product,
        message: `Product:${id} fetched`,
        statusCode: 200,
    });
});
//* create
exports.create = (0, catchAsync_utils_1.catchAsync)(async (req, res) => {
    console.log("BODY:", req.body);
    console.log("FILES:", req.files);
    const { cover_image, images } = req.files;
    const { name, description, price, brand, category, new_arrival, is_featured, } = req.body;
    if (!cover_image || !cover_image[0]) {
        throw new appError_utils_1.default("cover image is required", 400);
    }
    const product = new product_model_1.default({
        name,
        description,
        price,
        brand,
        category,
        new_arrival,
        is_featured,
    });
    //* upload cover_image
    const { path, public_id } = await (0, cloudinary_utils_1.upload)(cover_image[0], folder);
    product.cover_image = {
        path,
        public_id,
    };
    //Promise.all(arr_promise)
    //Promise.allSettled(arr_promise)
    //Promise.race(arr_promise)
    //Promise.any(arr_promise)
    //* upload images
    if (images && images.length > 0) {
        const promises = images.map((file) => (0, cloudinary_utils_1.upload)(file, folder));
        const files = await Promise.allSettled(promises);
        const fullFilled = files
            .filter((promise) => promise.status === "fulfilled")
            .map((img) => img.value);
        product.set("images", fullFilled);
    }
    //* save product
    await product.save();
    //* send response
    (0, sendResponse_utils_1.sendResponse)(res, {
        message: "product created",
        data: product,
        statusCode: 201,
    });
});
//* delete
exports.remove = (0, catchAsync_utils_1.catchAsync)(async (req, res) => {
    const { id } = req.params;
    const product = await product_model_1.default.findOne({ _id: id });
    if (!product)
        throw new appError_utils_1.default(`product not found`, 404);
    //* delete cover image
    (0, cloudinary_utils_1.deleteFile)(product.cover_image.public_id);
    //*delete images
    if (product.images && product.images.length > 0) {
        Promise.allSettled(product.images.map((img) => (0, cloudinary_utils_1.deleteFile)(img.public_id)));
    }
    //* delete product
    await product.deleteOne();
    //* send response
    (0, sendResponse_utils_1.sendResponse)(res, {
        message: `product: ${id} deleted`,
        statusCode: 200,
        data: null,
    });
});
//* update
// deleted_image = [public_ids]
// [5] => [3] + [2]
exports.update = (0, catchAsync_utils_1.catchAsync)(async (req, res) => {
    const { cover_image, images } = req.files;
    const { name, description, price, brand, category, new_arrival, is_featured, deleted_images, } = req.body;
    const { id } = req.params;
    const product = await product_model_1.default.findOne({ _id: id });
    if (!product)
        throw new appError_utils_1.default(`product not found`, 404);
    if (name)
        product.name = name;
    if (description)
        product.description = description;
    if (category)
        product.category = category;
    if (brand)
        product.brand = brand;
    if (price)
        product.price = price;
    if (new_arrival)
        product.new_arrival = new_arrival;
    if (is_featured)
        product.is_featured = is_featured;
    //* update cover image
    if (cover_image && cover_image[0]) {
        (0, cloudinary_utils_1.deleteFile)(product.cover_image.public_id);
        const { path, public_id } = await (0, cloudinary_utils_1.upload)(cover_image[0], folder);
        product.cover_image = {
            path,
            public_id,
        };
    }
    //* update images
    //* if deleted images
    if (deleted_images &&
        Array.isArray(deleted_images) &&
        deleted_images.length > 0) {
        Promise.allSettled(deleted_images.map((public_id) => (0, cloudinary_utils_1.deleteFile)(public_id)));
        product.images = product.images.filter((img) => !deleted_images.includes(img.public_id.toString()));
    }
    //* if new images
    if (images && images.length > 0) {
        // [{status:'',value:{path,public_id}}]
        const files = await Promise.allSettled(images.map((file) => (0, cloudinary_utils_1.upload)(file, folder)));
        const newImages = files
            .filter((file) => file.status === "fulfilled")
            .map((file) => file.value);
        product.set("images", [...product.images, ...newImages]);
    }
    //* save product
    await product.save();
    //* send successful response
    (0, sendResponse_utils_1.sendResponse)(res, {
        message: `product:${id} updated`,
        data: product,
        statusCode: 200,
    });
});
//* get by category
exports.getByCategory = (0, catchAsync_utils_1.catchAsync)(async (req, res, next) => {
    const { categoryId } = req.params;
    const category = await category_model_1.default.findById(categoryId);
    if (!category) {
        return next(new appError_utils_1.default("Category not found", 404));
    }
    const products = await product_model_1.default.find({
        category: categoryId,
    })
        .populate("category")
        .populate("brand");
    res.status(200).json({
        success: true,
        status: "success",
        message: "Products fetched successfully",
        total: products.length,
        data: products,
    });
});
//* get by brand
exports.getByBrand = (0, catchAsync_utils_1.catchAsync)(async (req, res, next) => {
    const { brandId } = req.params;
    const brand = await brand_model_1.default.findById(brandId);
    if (!brand) {
        return next(new appError_utils_1.default("Brand not found", 404));
    }
    const products = await product_model_1.default.find({
        brand: brandId,
    })
        .populate("category")
        .populate("brand");
    res.status(200).json({
        success: true,
        status: "success",
        message: "Products fetched successfully",
        total: products.length,
        data: products,
    });
});
//* get new arrivals
exports.getNewArrivals = (0, catchAsync_utils_1.catchAsync)(async (req, res) => {
    const products = await product_model_1.default.find({
        new_arrival: true,
    })
        .populate("category")
        .populate("brand")
        .sort({ createdAt: -1 });
    res.status(200).json({
        success: true,
        status: "success",
        message: "New arrival products fetched successfully",
        total: products.length,
        data: products,
    });
});
//* get featured
exports.getFeaturedProducts = (0, catchAsync_utils_1.catchAsync)(async (req, res) => {
    const products = await product_model_1.default.find({
        is_featured: true,
    })
        .populate("category")
        .populate("brand");
    res.status(200).json({
        success: true,
        status: "success",
        message: "Featured products fetched successfully",
        total: products.length,
        data: products,
    });
});
