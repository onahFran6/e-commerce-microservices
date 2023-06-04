import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import config from "../config";
import { ReqUserType } from "index";
// import { LoginAndsignupUserReturnType, UserDoc } from "userType";

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

// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
export const FormatData = (data: any): any => {
  if (data) {
    return { data };
  } else {
    throw new Error("Data Not found!");
  }
};

export const verifyAuthorizationToken = async ({
  req,
}: {
  req: ReqUserType;
}): Promise<boolean> => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader.split(" ")[1];
    console.log(authHeader);

    if (token) {
      const payload = jwt.verify(token, JWT_SECRET);
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      req.payload = payload;
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.log(error);
    return false;
  }
};
