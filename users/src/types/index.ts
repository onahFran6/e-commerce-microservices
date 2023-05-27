export interface EnvironmentConfig {
  PORT: number;
  MONGODB_URI: string;
  API_KEY: string;
  JWT_SECRET_KEY: string;

  // Add more environment-specific variables here ok
}
