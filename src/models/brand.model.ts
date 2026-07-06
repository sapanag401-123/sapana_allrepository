import mongoose, { Schema, Document } from "mongoose";

// Interface
export interface IBrand extends Document {
  name: string;
  description: string;
  logo: string;
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
      type: String,
      required: [true, "Logo is required"],
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Brand Model
const Brand = mongoose.model<IBrand>("Brand", brandSchema);

export default Brand;