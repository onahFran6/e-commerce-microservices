import mongoose from "mongoose";

export interface UserDoc extends mongoose.Document {
  email: string;
  password: string;
  username: string;
}

export interface CreateUserInputType {
  username: string;
  email: string;
  password: string;
}

export interface LoginUserInputType {
  email: string;
  password: string;
}

export interface LoginAndsignupUserReturnType {
  id: string;
  token: string;
}
