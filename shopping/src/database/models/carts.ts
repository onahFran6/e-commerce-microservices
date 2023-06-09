import mongoose from "mongoose";
import { CartDoc } from "orderType";

const CartSchema = new mongoose.Schema({
  userId: { type: String },
  items: [
    {
      product: {
        _id: { type: String, require: true },
        name: { type: String },
        desc: { type: String },
        banner: { type: String },
        type: { type: String },
        unit: { type: Number },
        price: { type: Number },
        suplier: { type: String },
      },
      unit: { type: Number, require: true },
    },
  ],
});

const CartModel = mongoose.model<CartDoc>("Cart", CartSchema);

export default CartModel;
