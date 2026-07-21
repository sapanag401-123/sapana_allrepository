import mongoose from "mongoose";

//{user:user_id , items[{product:product_id,quantity:number}]}
// user:1 , product:1 , quantity:2
//  product:2 , quantity:2
//  product:1 , quantity:3 -> X
const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: [true, "user is required"],
    },
    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "product",
          required: [true, "product is required"],
        },
        quantity: {
          type: Number,
          default: 1,
        },
      },
    ],
  },
  { timestamps: true },
);

const Cart = mongoose.model("cart", cartSchema);
export default Cart;