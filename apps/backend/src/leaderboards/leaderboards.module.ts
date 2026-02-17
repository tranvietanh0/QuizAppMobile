import { Module } from "@nestjs/common";

import { LeaderboardsController } from "./leaderboards.controller";
import { LeaderboardsService } from "./leaderboards.service";
import { PrismaModule } from "../prisma/prisma.module";

@Module({
  imports: [PrismaModule],
  controllers: [LeaderboardsController],
  providers: [LeaderboardsService],
  exports: [LeaderboardsService],
})
export class LeaderboardsModule {}
