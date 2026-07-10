import mongoose, { Schema, Document } from "mongoose";
import ImageSchema from "./image.model";
import { IImage } from "../types/global.types";
// Interface
export interface IBrand extends Document {
  name: string;
  description: string;
  logo: IImage;
}

// Brand Schema
const brandSchema = new Schema<IBrand>(
  {
    name: {
      type: String,
      required: [true, "Brand name is required"],
      trim: true,
      unique: true,
      minLength: 2,
      maxLength: 100,
    },

    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
      minLength: 25,
      maxLength: 500,
    },

    logo: {
      type:ImageSchema ,
      required: [true, "Logo is required"],
    },
  },
  {
    timestamps: true,
  }
);

// Brand Model
const Brand = mongoose.model<IBrand>("Brand", brandSchema);

export default Brand;