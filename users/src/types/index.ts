import { Request } from "express";

export interface EnvironmentConfig {
  PORT: number;
  MONGODB_URI: string;
  API_KEY: string;
  JWT_SECRET_KEY: string;

  // Add more environment-specific variables here ok
}

export declare interface ReqUserType extends Request {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  payload: any;
}
