import mongoose from "mongoose";
import ImageSchema from "./image.model";

// User Schema
const userSchema = new mongoose.Schema(
  {
    full_name: {
      type: String,
      required: [true,"full_name is required"],
      minlength: [3, "name must be at 3 character long"],
      trim:  true,
    },
    email: {
      type: String,
      required: [true, "email is required"],
      unique: [true, "user already exists with provided email"],
      trim: true,
    },
    password: {
      type: String,
      required: [true, "password is required"],
      select: false,
    },

    profile_image:{
      type : ImageSchema,
      default:null,


    },
    role:{
      type: String,
      enum: ["USER","ADMIN","SUPER ADMIN"],
      default: "USER",
    },


    phone_number:{
      type: String,
      required: false,
      maxLength: [10, "phone number at nost be 10 digits long"],

    },
  },
  {timestamps: true,}
);

// Create User Model
const User = mongoose.model("user", userSchema);

export default User;