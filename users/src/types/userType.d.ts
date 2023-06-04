import mongoose from "mongoose";

export interface UserDoc extends mongoose.Document {
  email: string;
  password: string;
  username: string;
  phoneNumber: string;
  address?: AddressDoc[];
  cart?: CartType[];
  wishList?: WishListType[];
  orders?: OrdersType[];
}

export interface CreateUserInputType {
  username: string;
  email: string;
  password: string;
  phoneNumber: string;
}

export interface LoginUserInputType {
  email: string;
  password: string;
}

export interface LoginAndsignupUserReturnType {
  id: string;
  token: string;
}

export interface AddressDoc extends mongoose.Document {
  street: string;
  postalCode: string;
  city: string;
  country: string;
}

export interface createAddressInputType {
  userId: mongoose.Types.ObjectId;
  street: string;
  postalCode: string;
  city: string;
  country: string;
}

export interface CartType {
  product: {
    _id: mongoose.Types.ObjectId;
    name: string;
    banner?: string;
    price: number;
  };
  unit: number;
}

export interface WishListType {
  _id: mongoose.Types.ObjectId;
  name: string;
  description?: string;
  banner?: string;
  avalable: boolean;
  price: number;
}

export interface OrdersType {
  _id: mongoose.Types.ObjectId;
  amount: string;
  date: Date;
}
