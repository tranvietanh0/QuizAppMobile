import { Test, TestingModule } from "@nestjs/testing";
import { ConfigService } from "@nestjs/config";

import { AppService } from "./app.service";

describe("AppService", () => {
  let service: AppService;
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AppService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              const config: Record<string, string> = {
                NODE_ENV: "test",
              };
              return config[key];
            }),
          },
        },
      ],
    }).compile();

    service = module.get<AppService>(AppService);
    configService = module.get<ConfigService>(ConfigService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("getHealth", () => {
    it("should return health status", () => {
      const result = service.getHealth();

      expect(result).toHaveProperty("status", "ok");
      expect(result).toHaveProperty("timestamp");
      expect(result).toHaveProperty("uptime");
      expect(result).toHaveProperty("version", "1.0.0");
      expect(result).toHaveProperty("environment", "test");
    });
  });

  describe("getApiInfo", () => {
    it("should return API information", () => {
      const result = service.getApiInfo();

      expect(result).toHaveProperty("name", "QuizApp API");
      expect(result).toHaveProperty("version", "1.0.0");
      expect(result).toHaveProperty("description");
      expect(result).toHaveProperty("documentation", "/api/docs");
      expect(result).toHaveProperty("health", "/api/v1/health");
      expect(result).toHaveProperty("startedAt");
    });
  });
});
