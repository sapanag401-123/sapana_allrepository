"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const ImageSchema = new mongoose_1.default.Schema({
    path: {
        type: String,
        required: [true, "Path is required"],
    },
    public_id: {
        type: String,
        required: [true, "Public ID is required"],
    },
}, {
    _id: false,
});
exports.default = ImageSchema;
