import * as Joi from "joi";

export const ConfigValidationSchema = Joi.object({
  // Server
  NODE_ENV: Joi.string()
    .valid("development", "production", "test")
    .default("development"),
  PORT: Joi.number().default(3000),
  HOST: Joi.string().default("0.0.0.0"),

  // Database
  DATABASE_URL: Joi.string().required(),

  // JWT
  JWT_SECRET: Joi.string().required().min(32),
  JWT_REFRESH_SECRET: Joi.string().required().min(32),
  JWT_ACCESS_EXPIRATION: Joi.string().default("15m"),
  JWT_REFRESH_EXPIRATION: Joi.string().default("7d"),

  // CORS
  CORS_ORIGINS: Joi.string().default("http://localhost:3000,http://localhost:8081"),

  // Swagger
  SWAGGER_ENABLED: Joi.string().valid("true", "false").default("true"),

  // Rate Limiting
  THROTTLE_TTL: Joi.number().default(60),
  THROTTLE_LIMIT: Joi.number().default(100),
});
