import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { APP_GUARD } from "@nestjs/core";

import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { PrismaModule } from "../prisma/prisma.module";
import { ConfigValidationSchema, appConfig } from "../config";
import { AuthModule } from "../auth/auth.module";
import { JwtAuthGuard } from "../common/guards";

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

    // Feature Modules
    AuthModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    // Global JWT Auth Guard - all routes protected by default
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
