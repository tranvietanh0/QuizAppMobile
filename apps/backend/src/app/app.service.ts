import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class AppService {
  private readonly startTime: Date;

  constructor(private readonly configService: ConfigService) {
    this.startTime = new Date();
  }

  getHealth() {
    return {
      status: "ok",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      version: "1.0.0",
      environment: this.configService.get<string>("NODE_ENV"),
    };
  }

  getApiInfo() {
    return {
      name: "QuizApp API",
      version: "1.0.0",
      description: "QuizApp Mobile Backend API",
      documentation: "/api/docs",
      health: "/api/v1/health",
      startedAt: this.startTime.toISOString(),
    };
  }
}
