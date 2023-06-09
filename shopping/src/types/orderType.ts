import mongoose from "mongoose";

export interface OrderDoc extends mongoose.Document {
  orderId: string;
  userId: string;
  amount: string;
  status: string;
  items: ItemType[];
}

export interface ProductType {
  _id: string;
  name: string;
  desc: string;
  banner: string;
  type: string;
  unit: number;
  price: number;
  suplier: string;
}

export interface ItemType {
  product: ProductType;
  unit: number;
}

export interface CartDoc extends mongoose.Document {
  userId: string;
  items: ItemType[];
}
