import { Test, TestingModule } from "@nestjs/testing";

import { AppController } from "./app.controller";
import { AppService } from "./app.service";

describe("AppController", () => {
  let controller: AppController;
  let service: AppService;

  const mockAppService = {
    getHealth: jest.fn().mockReturnValue({
      status: "ok",
      timestamp: new Date().toISOString(),
      uptime: 100,
      version: "1.0.0",
      environment: "test",
    }),
    getApiInfo: jest.fn().mockReturnValue({
      name: "QuizApp API",
      version: "1.0.0",
      description: "QuizApp Mobile Backend API",
      documentation: "/api/docs",
      health: "/api/v1/health",
      startedAt: new Date().toISOString(),
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        {
          provide: AppService,
          useValue: mockAppService,
        },
      ],
    }).compile();

    controller = module.get<AppController>(AppController);
    service = module.get<AppService>(AppService);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  describe("getHealth", () => {
    it("should return health status", () => {
      const result = controller.getHealth();

      expect(result.status).toBe("ok");
      expect(service.getHealth).toHaveBeenCalled();
    });
  });

  describe("getRoot", () => {
    it("should return API info", () => {
      const result = controller.getRoot();

      expect(result.name).toBe("QuizApp API");
      expect(service.getApiInfo).toHaveBeenCalled();
    });
  });
});
