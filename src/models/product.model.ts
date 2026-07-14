import mongoose from "mongoose";
// import { Role } from "../types/enum.types";
import ImageSchema from "./image.model";

//* product schema
const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "name is required"],
      minLength: 3, 
      trim: true,
    },
    category: {
      type: String,
      required: [true, "category is required"],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, "price is required"],
      min: 0,

    },
    stock: {
      type: Number,
      required: [true, "Stock is required"],
      default: null,
    },
    image: {
    type: ImageSchema,
    default: null,
    },
  },
  { timestamps: true },
);

//* user model
const Product = mongoose.model("product", productSchema);
export default Product;