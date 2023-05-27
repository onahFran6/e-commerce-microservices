import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import config from "../config";
import { LoginAndsignupUserReturnType } from "userType";

const JWT_SECRET = config.JWT_SECRET_KEY;

export const GenerateHashedPassword = async ({
  password,
}: {
  password: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
}): Promise<any> => {
  const salt = await bcrypt.genSalt();
  return await bcrypt.hash(password, salt);
};

export const ValidatePassword = async ({
  password,
  existingPassword,
}: {
  password: string;
  existingPassword: string;
}): Promise<boolean> => {
  const isValidated = await bcrypt.compare(password, existingPassword);

  return isValidated;
};

export const GenerateUserToken = async ({
  payload,
}: {
  payload: { id: string };
}): Promise<string> => {
  const UserToken = jwt.sign(payload, JWT_SECRET, { expiresIn: "30d" });
  return UserToken;
};

export const FormatData = (data: {
  id: string;
  token: string;
}): LoginAndsignupUserReturnType => {
  if (data) {
    return { data };
  } else {
    throw new Error("Data Not found!");
  }
};
