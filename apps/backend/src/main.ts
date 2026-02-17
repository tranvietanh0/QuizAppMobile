import { NestFactory } from "@nestjs/core";
import { FastifyAdapter, NestFastifyApplication } from "@nestjs/platform-fastify";
import { ValidationPipe, VersioningType } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

import { AppModule } from "./app/app.module";
import { HttpExceptionFilter } from "./common/filters/http-exception.filter";
import { TransformInterceptor } from "./common/interceptors/transform.interceptor";

async function bootstrap() {
  // Create Fastify adapter with custom options
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({
      logger: true,
    })
  );

  const configService = app.get(ConfigService);

  // Global prefix
  app.setGlobalPrefix("api");

  // API Versioning
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: "1",
  });

  // CORS Configuration
  const isDev = configService.get<string>("NODE_ENV") === "development";
  const corsOrigins = configService.get<string>("CORS_ORIGINS")?.split(",") || [
    "http://localhost:3000",
    "http://localhost:8081",
  ];

  app.enableCors({
    // Allow all origins in development for easier mobile testing
    origin: isDev ? true : corsOrigins,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization", "Accept"],
  });

  // Global Validation Pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    })
  );

  // Global Exception Filter
  app.useGlobalFilters(new HttpExceptionFilter());

  // Global Response Transform Interceptor
  app.useGlobalInterceptors(new TransformInterceptor());

  // Swagger Documentation
  const swaggerEnabled = configService.get<string>("SWAGGER_ENABLED") === "true";
  if (swaggerEnabled) {
    const config = new DocumentBuilder()
      .setTitle("QuizApp API")
      .setDescription("QuizApp Mobile Backend API Documentation")
      .setVersion("1.0")
      .addBearerAuth(
        {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          name: "JWT",
          description: "Enter JWT token",
          in: "header",
        },
        "JWT-auth"
      )
      .addTag("Auth", "Authentication endpoints")
      .addTag("Users", "User management endpoints")
      .addTag("Health", "Health check endpoints")
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup("api/docs", app, document, {
      swaggerOptions: {
        persistAuthorization: true,
        tagsSorter: "alpha",
        operationsSorter: "alpha",
      },
    });
  }

  // Start server
  const port = configService.get<number>("PORT") || 3000;
  const host = configService.get<string>("HOST") || "0.0.0.0";

  await app.listen(port, host);

  console.log(`
  ================================================
    QuizApp Backend API
  ================================================
    Environment: ${configService.get<string>("NODE_ENV")}
    Server:      http://${host}:${port}
    Swagger:     http://${host}:${port}/api/docs
  ================================================
  `);
}

bootstrap();
