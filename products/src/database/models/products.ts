import mongoose from "mongoose";
import { ProductDoc } from "productType";

const ProductSchema = new mongoose.Schema(
  {
    name: { type: String },
    desc: { type: String },
    banner: { type: String },
    type: { type: String },
    unit: { type: Number },
    price: { type: Number },
    available: { type: Boolean },
    suplier: { type: String },
  },

  {
    toJSON: {
      transform(doc, ret) {
        delete ret.__v;
      },
    },
    timestamps: true,
  }
);

const ProductModel = mongoose.model<ProductDoc>("Product", ProductSchema);

export default ProductModel;
