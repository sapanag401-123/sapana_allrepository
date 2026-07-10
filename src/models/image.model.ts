import mongoose from "mongoose";

const ImageSchema = new mongoose.Schema(
  {
    path: {
      type: String,
      required: [true, "Path is required"],
    },
    public_id: {
      type: String,
      required: [true, "Public ID is required"],
    },
  },
  {
    _id: false,
  }
);

export default ImageSchema;