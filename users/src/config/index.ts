import { EnvironmentConfig } from "index";
import dotenv from "dotenv";

dotenv.config();

const development: EnvironmentConfig = {
  PORT: parseInt(process.env.DEV_PORT as string, 10) || 3000,
  MONGODB_URI: process.env.DEV_MONGODB_URI || "mongodb://localhost/myapp_dev",
  API_KEY: process.env.DEV_API_KEY || "application",
  JWT_SECRET_KEY: process.env.DEV_JWT_SECRET_KEY || "test_secret",
  // Add more development environment variables here
};

const test: EnvironmentConfig = {
  PORT: parseInt(process.env.TEST_PORT as string, 10) || 4000,
  MONGODB_URI: process.env.TEST_MONGODB_URI || "mongodb://localhost/myapp_test",
  API_KEY: process.env.TEST_API_KEY || "your_test_api_key",
  JWT_SECRET_KEY: process.env.TEST_JWT_SECRET_KEY || "test_secret",
  // Add more test environment variables here
};

const production: EnvironmentConfig = {
  PORT: parseInt(process.env.PORT as string, 10) || 5000,
  MONGODB_URI: process.env.MONGODB_URI || "mongodb://localhost/myapp",
  API_KEY: process.env.API_KEY || "your_production_api_key",
  JWT_SECRET_KEY: process.env.JWT_SECRET_KEY || "test_secret",
  // Add more production environment variables here
};

let config: EnvironmentConfig;

switch (process.env.NODE_ENV) {
  case "development":
    config = development;
    break;
  case "test":
    config = test;
    break;
  case "production":
    config = production;
    break;
  default:
    config = development;
    break;
}

export default config;
