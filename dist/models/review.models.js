"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const reviewSchema = new mongoose_1.default.Schema({
    user: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "user",
        required: [true, "user is required"],
    },
    product: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "product",
        required: [true, "product is required"],
    },
    rating: {
        type: Number,
        default: 0,
    },
    text: {
        type: String,
        required: true,
        minLength: 5,
        maxLength: 500,
    },
}, { timestamps: true });
const Review = mongoose_1.default.model("review", reviewSchema);
exports.default = Review;
