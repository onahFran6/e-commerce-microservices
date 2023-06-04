// import mongoose, { Document } from "mongoose";
import AddressModel from "../models/address";
import UserModel from "../models/users";
import {
  UserDoc,
  CreateUserInputType,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  AddressDoc,
  createAddressInputType,
  WishListType,
  CartType,
  OrdersType,
} from "userType";

class UserRepository {
  public async CreateUser({
    email,
    password,
    username,
    phoneNumber,
  }: CreateUserInputType): Promise<Partial<UserDoc>> {
    const user = new UserModel({
      email,
      password,
      username,
      phoneNumber,
    });

    const newUser = await user.save();
    return newUser;
  }

  public async FindIfUserAlreadyExistByEmail({
    email,
  }: {
    email: string;
  }): Promise<boolean> {
    const user = await UserModel.findOne({ email: email });
    if (!user) {
      return true;
    }
    return false;
  }

  public async FindUserByEmail({
    email,
  }: {
    email: string;
  }): Promise<Partial<UserDoc>> {
    const user = await UserModel.findOne({ email: email });
    // console.log("====>>>>> ", user);
    return user;
  }

  public async FindUserById({
    userId,
  }: {
    userId: string;
  }): Promise<Partial<UserDoc>> {
    const user = await UserModel.findById(userId);
    // console.log("====>>>>> ", user);
    return user;
  }

  public async CreateAddress({
    userId,
    street,
    postalCode,
    city,
    country,
  }: createAddressInputType): Promise<Partial<UserDoc>> {
    const user = await UserModel.findById(userId);

    if (user) {
      const newAddress = new AddressModel({
        street,
        postalCode,
        city,
        country,
      });

      await newAddress.save();

      user.address.push(newAddress);
    }

    return (await user.save()).populate("address");
  }

  public async WishList({
    userId,
  }: {
    userId: string;
  }): Promise<WishListType[]> {
    const user = await UserModel.findById(userId).populate("wishList");
    return user.wishList;
  }

  public async AddWishListItem({
    userId,
    product,
  }: {
    userId: string;
    product: WishListType;
  }): Promise<WishListType[]> {
    try {
      const user = await UserModel.findById(userId).populate("wishList");
      let wishList: WishListType[];

      if (user) {
        wishList = user.wishList;

        if (wishList.length > 0) {
          let isExist = false;
          wishList.forEach((item, index) => {
            if (item._id.toString() === product._id.toString()) {
              wishList.splice(index, 1);
              isExist = true;
            }
          });

          if (!isExist) {
            wishList.push(product);
          }
        } else {
          wishList.push(product);
        }

        user.wishList = wishList;
        const userResult = await user.save();

        return userResult.wishList;
      } else {
        throw new Error("user not found");
      }
    } catch (error) {
      throw new Error("Error adding wishList item: " + error.message);
    }
  }

  public async AddCartItem({
    userId,
    product,
    qty,
    isRemove,
  }: {
    userId: string;
    product: WishListType;
    qty: number;
    isRemove: boolean;
  }): Promise<Partial<UserDoc>> {
    try {
      let cartItems: CartType[];
      const user = await UserModel.findById(userId).populate("cart");

      if (user) {
        const cartItem: CartType = {
          product: { ...product },
          unit: qty,
        };

        cartItems = user.cart;

        if (cartItems.length > 0) {
          let isExist = false;
          cartItems.forEach((item, index) => {
            if (item.product._id.toString() === product._id.toString()) {
              if (isRemove) {
                cartItems.splice(index, 1);
              } else {
                item.unit = qty;
              }
              isExist = true;
            }
          });

          if (!isExist) {
            cartItems.push(cartItem);
          }
        } else {
          cartItems.push(cartItem);
        }

        user.cart = cartItems;

        return await user.save();
      } else {
        throw new Error("user not found");
      }
    } catch (error) {
      throw new Error("Error adding cart item: " + error.message);
    }
  }

  public async AddOrderToUser({
    userId,
    order,
  }: {
    userId: string;
    order: OrdersType;
  }): Promise<Partial<UserDoc>> {
    try {
      const user = await UserModel.findById(userId);

      if (user) {
        if (user.orders === undefined) {
          user.orders = [];
        }
        user.orders.push(order);

        user.cart = [];

        const userResult = await user.save();

        return userResult;
      } else {
        throw new Error("user not found");
      }
    } catch (error) {
      throw new Error("Error adding order: " + error.message);
    }
  }
}

export default UserRepository;
