"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const image_model_1 = __importDefault(require("./image.model"));
//* product schema
const productSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: [true, "name is required"],
        trim: true,
        minLength: 3,
    },
    price: {
        type: Number,
        required: [true, "price is required"],
        min: 0,
    },
    description: {
        type: String,
        required: [true, "description is required"],
        minLength: 30,
        maxLength: 500,
    },
    cover_image: {
        type: image_model_1.default,
        required: [true, "cover image is required"],
    },
    category: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        required: [true, "category is required"],
        ref: "category",
    },
    brand: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        required: [true, "brand is required"],
        ref: "brand",
    },
    images: [
        {
            type: image_model_1.default,
            default: null,
        },
    ],
    new_arrival: {
        type: Boolean,
        default: true,
    },
    is_featured: {
        type: Boolean,
        default: false,
    },
}, { timestamps: true });
//* product model
const Product = mongoose_1.default.model("product", productSchema);
exports.default = Product;
