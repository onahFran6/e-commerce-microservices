import { Response, NextFunction } from "express";
import { verifyAuthorizationToken } from "../util";
import { ReqUserType } from "index";

export const verifyUser = async (
  req: ReqUserType,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const isAuthorized = await verifyAuthorizationToken({ req });

  if (isAuthorized) {
    return next();
  }
  res.status(401).json({ message: "User Not Authorized" });
  return;
};
