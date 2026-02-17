import { Module } from "@nestjs/common";

import { QuizSessionsController } from "./quiz-sessions.controller";
import { QuizSessionsService } from "./quiz-sessions.service";
import { PrismaModule } from "../prisma/prisma.module";
import { QuestionsModule } from "../questions/questions.module";
import { CategoriesModule } from "../categories/categories.module";

@Module({
  imports: [PrismaModule, QuestionsModule, CategoriesModule],
  controllers: [QuizSessionsController],
  providers: [QuizSessionsService],
  exports: [QuizSessionsService],
})
export class QuizSessionsModule {}
