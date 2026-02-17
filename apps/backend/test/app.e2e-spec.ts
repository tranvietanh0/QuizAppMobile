import { Test, TestingModule } from "@nestjs/testing";
import {
  FastifyAdapter,
  NestFastifyApplication,
} from "@nestjs/platform-fastify";

import { AppModule } from "../src/app/app.module";

describe("AppController (e2e)", () => {
  let app: NestFastifyApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication<NestFastifyApplication>(
      new FastifyAdapter()
    );

    app.setGlobalPrefix("api");
    await app.init();
    await app.getHttpAdapter().getInstance().ready();
  });

  afterAll(async () => {
    await app.close();
  });

  describe("GET /api/v1/health", () => {
    it("should return health status", async () => {
      const result = await app.inject({
        method: "GET",
        url: "/api/v1/health",
      });

      expect(result.statusCode).toBe(200);

      const body = JSON.parse(result.payload);
      expect(body.success).toBe(true);
      expect(body.data.status).toBe("ok");
    });
  });

  describe("GET /api", () => {
    it("should return API info", async () => {
      const result = await app.inject({
        method: "GET",
        url: "/api",
      });

      expect(result.statusCode).toBe(200);

      const body = JSON.parse(result.payload);
      expect(body.success).toBe(true);
      expect(body.data.name).toBe("QuizApp API");
    });
  });
});
