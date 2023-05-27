// import mongoose, { Document } from "mongoose";
import UserModel from "../models/users";
import { UserDoc, CreateUserInputType } from "userType";

class UserRepository {
  public async CreateUser({
    email,
    password,
    username,
  }: CreateUserInputType): Promise<Partial<UserDoc>> {
    const customer = new UserModel({
      email,
      password,
      username,
    });

    const newUser = await customer.save();
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
    email,
  }: {
    email: string;
  }): Promise<Partial<UserDoc>> {
    const user = await UserModel.findOne({ email: email });
    // console.log("====>>>>> ", user);
    return user;
  }
}

export default UserRepository;
