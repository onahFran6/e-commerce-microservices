import mongoose from "mongoose";

export interface ProductDoc extends mongoose.Document {
  name: string;
  desc: string;
  banner: string;
  type: string;
  unit: number;
  price: number;
  available: boolean;
  suplier: string;
}

export interface CreateProductInputType {
  name: string;
  desc: string;
  banner: string;
  type: string;
  unit: number;
  price: number;
  available: boolean;
  suplier: string;
}
