import { registerAs } from "@nestjs/config";

export const appConfig = registerAs("app", () => ({
  nodeEnv: process.env["NODE_ENV"] || "development",
  port: parseInt(process.env["PORT"] || "3000", 10),
  host: process.env["HOST"] || "0.0.0.0",

  // JWT Configuration
  jwt: {
    secret: process.env["JWT_SECRET"],
    refreshSecret: process.env["JWT_REFRESH_SECRET"],
    accessExpiration: process.env["JWT_ACCESS_EXPIRATION"] || "15m",
    refreshExpiration: process.env["JWT_REFRESH_EXPIRATION"] || "7d",
  },

  // Database
  database: {
    url: process.env["DATABASE_URL"],
  },

  // CORS
  cors: {
    origins: process.env["CORS_ORIGINS"]?.split(",") || [
      "http://localhost:3000",
      "http://localhost:8081",
    ],
  },

  // Swagger
  swagger: {
    enabled: process.env["SWAGGER_ENABLED"] === "true",
  },

  // Rate Limiting
  throttle: {
    ttl: parseInt(process.env["THROTTLE_TTL"] || "60", 10),
    limit: parseInt(process.env["THROTTLE_LIMIT"] || "100", 10),
  },
}));

export type AppConfig = ReturnType<typeof appConfig>;
