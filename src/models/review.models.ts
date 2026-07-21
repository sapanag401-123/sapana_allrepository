import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: [true, "user is required"],
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
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
  },
  { timestamps: true },
);

const Review = mongoose.model("review", reviewSchema);
export default Review;