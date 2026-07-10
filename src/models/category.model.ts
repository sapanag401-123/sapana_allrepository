import mongoose, { Schema, Document } from "mongoose";
import { IImage } from "../types/global.types";
import ImageSchema from "./image.model";

//* Interface
export interface ICategory extends Document {
  name: string;
  description?: string;
  logo: IImage;
}

//* Category Schema
const categorySchema = new Schema<ICategory>(
  {
    name: {
      type: String,
      required: [true, "Category name is required"],
      trim: true,
      unique: true,
      minLength: 2,
      maxLength: 100,
    },

    description: {
      type: String,
      trim: true,
      minLength: 25,
      maxLength: 500,
    },

    logo: {
      type: ImageSchema,
      required: [true, "Logo is required"],
    },
  },
  {
    timestamps: true,
  },
);

//* Category Model
const Category = mongoose.model<ICategory>("category", categorySchema);

export default Category;