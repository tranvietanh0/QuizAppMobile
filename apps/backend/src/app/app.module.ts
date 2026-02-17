import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { PrismaModule } from "../prisma/prisma.module";
import { ConfigValidationSchema, appConfig } from "../config";

@Module({
  imports: [
    // Configuration Module
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [".env.local", ".env"],
      load: [appConfig],
      validationSchema: ConfigValidationSchema,
      validationOptions: {
        abortEarly: true,
      },
    }),

    // Database Module
    PrismaModule,

    // Feature Modules will be added here
    // AuthModule,
    // UsersModule,
    // etc.
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
