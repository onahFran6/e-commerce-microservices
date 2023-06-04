import mongoose from "mongoose";
import { AddressDoc } from "userType";

const addressSchema = new mongoose.Schema(
  {
    street: { type: String, required: true },
    postalCode: { type: String, required: true },
    city: { type: String, required: true },
    country: { type: String, required: true },
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

const AddressModel = mongoose.model<AddressDoc>("Address", addressSchema);

export default AddressModel;
