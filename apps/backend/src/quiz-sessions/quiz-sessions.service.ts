import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
  Logger,
} from "@nestjs/common";
import { QuizSessionStatus, Question, QuestionType, Difficulty } from "@prisma/client";

import { PrismaService } from "../prisma/prisma.service";
import { QuestionsService } from "../questions/questions.service";
import { CategoriesService } from "../categories/categories.service";
import { PaginationDto } from "../common/dto";
import {
  StartQuizDto,
  SubmitAnswerDto,
  QuizSessionResponseDto,
  SessionQuestionDto,
  AnswerResultDto,
  QuizResultDto,
  AnswerReviewDto,
  PaginatedSessionsDto,
  SessionSummaryDto,
} from "./dto";

@Injectable()
export class QuizSessionsService {
  private readonly logger = new Logger(QuizSessionsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly questionsService: QuestionsService,
    private readonly categoriesService: CategoriesService
  ) {}

  /**
   * Start a new quiz session
   */
  async startSession(userId: string, data: StartQuizDto): Promise<QuizSessionResponseDto> {
    const { categoryId, difficulty, questionCount = 10 } = data;

    // 1. Validate category exists
    const category = await this.categoriesService.findById(categoryId);

    // 2. Get random questions from QuestionsService
    const questions = await this.questionsService.getRandomQuestions(
      categoryId,
      questionCount,
      difficulty
    );

    if (questions.length === 0) {
      throw new BadRequestException(
        `No questions available for category "${category.name}"${difficulty ? ` with difficulty "${difficulty}"` : ""}`
      );
    }

    // 3. Create QuizSession record with questionIds
    const questionIds = questions.map((q) => q.id);

    const session = await this.prisma.quizSession.create({
      data: {
        userId,
        categoryId,
        totalQuestions: questions.length,
        questionIds,
        status: QuizSessionStatus.IN_PROGRESS,
      },
      include: {
        category: true,
      },
    });

    this.logger.log(
      `Started quiz session ${session.id} for user ${userId} with ${questions.length} questions`
    );

    // 4. Return session with questions (WITHOUT correctAnswer)
    return {
      id: session.id,
      userId: session.userId,
      categoryId: session.categoryId,
      categoryName: session.category.name,
      status: session.status,
      score: session.score,
      totalQuestions: session.totalQuestions,
      correctAnswers: session.correctAnswers,
      currentIndex: session.currentIndex,
      questions: questions.map((q) => this.toSessionQuestionDto(q)),
      answeredQuestionIds: [],
      startedAt: session.startedAt,
      completedAt: session.completedAt,
    };
  }

  /**
   * Submit an answer for a question
   */
  async submitAnswer(userId: string, data: SubmitAnswerDto): Promise<AnswerResultDto> {
    const { sessionId, questionId, selectedAnswer, timeSpent } = data;

    // 1. Validate session belongs to user and is IN_PROGRESS
    const session = await this.prisma.quizSession.findUnique({
      where: { id: sessionId },
      include: {
        userAnswers: true,
      },
    });

    if (!session) {
      throw new NotFoundException(`Quiz session with ID "${sessionId}" not found`);
    }

    if (session.userId !== userId) {
      throw new ForbiddenException("You do not have access to this quiz session");
    }

    if (session.status !== QuizSessionStatus.IN_PROGRESS) {
      throw new BadRequestException(
        `Cannot submit answer to a ${session.status.toLowerCase()} session`
      );
    }

    // 2. Validate question is in session and not already answered
    const questionIds = session.questionIds as string[];
    if (!questionIds.includes(questionId)) {
      throw new BadRequestException("This question is not part of the current quiz session");
    }

    const existingAnswer = session.userAnswers.find((a) => a.questionId === questionId);
    if (existingAnswer) {
      throw new BadRequestException("This question has already been answered");
    }

    // 3. Get the full question to check the answer
    const question = await this.prisma.question.findUnique({
      where: { id: questionId },
    });

    if (!question) {
      throw new NotFoundException(`Question with ID "${questionId}" not found`);
    }

    // 4. Check if answer is correct
    const isCorrect = selectedAnswer === question.correctAnswer;

    // 5. Calculate points (bonus for quick answer)
    const { totalPoints, timeBonus } = this.calculatePoints(question, timeSpent, isCorrect);

    // 6. Create UserAnswer record and update session
    await this.prisma.$transaction([
      // Create user answer
      this.prisma.userAnswer.create({
        data: {
          sessionId,
          questionId,
          selectedAnswer,
          isCorrect,
          pointsEarned: totalPoints,
          timeSpent,
        },
      }),
      // Update session score and correctAnswers
      this.prisma.quizSession.update({
        where: { id: sessionId },
        data: {
          score: { increment: totalPoints },
          correctAnswers: isCorrect ? { increment: 1 } : undefined,
          currentIndex: { increment: 1 },
        },
      }),
    ]);

    // Get updated session for response
    const updatedSession = await this.prisma.quizSession.findUnique({
      where: { id: sessionId },
    });

    const isLastQuestion = updatedSession!.currentIndex >= updatedSession!.totalQuestions;

    this.logger.log(
      `User ${userId} answered question ${questionId} in session ${sessionId}: ${isCorrect ? "correct" : "incorrect"} (+${totalPoints} points)`
    );

    // 7. Return result with correct answer and explanation
    return {
      isCorrect,
      correctAnswer: question.correctAnswer,
      explanation: question.explanation,
      pointsEarned: totalPoints,
      basePoints: question.points,
      timeBonus,
      totalScore: updatedSession!.score,
      correctAnswersCount: updatedSession!.correctAnswers,
      currentIndex: updatedSession!.currentIndex,
      isLastQuestion,
    };
  }

  /**
   * Get current session state
   */
  async getSession(userId: string, sessionId: string): Promise<QuizSessionResponseDto> {
    const session = await this.prisma.quizSession.findUnique({
      where: { id: sessionId },
      include: {
        category: true,
        userAnswers: true,
      },
    });

    if (!session) {
      throw new NotFoundException(`Quiz session with ID "${sessionId}" not found`);
    }

    if (session.userId !== userId) {
      throw new ForbiddenException("You do not have access to this quiz session");
    }

    // Get questions for the session
    const questionIds = session.questionIds as string[];
    const questions = await this.prisma.question.findMany({
      where: { id: { in: questionIds } },
    });

    // Sort questions by their order in questionIds
    const sortedQuestions = questionIds
      .map((id) => questions.find((q) => q.id === id))
      .filter((q): q is Question => q !== undefined);

    const answeredQuestionIds = session.userAnswers.map((a) => a.questionId);

    return {
      id: session.id,
      userId: session.userId,
      categoryId: session.categoryId,
      categoryName: session.category.name,
      status: session.status,
      score: session.score,
      totalQuestions: session.totalQuestions,
      correctAnswers: session.correctAnswers,
      currentIndex: session.currentIndex,
      questions: sortedQuestions.map((q) => this.toSessionQuestionDto(q)),
      answeredQuestionIds,
      startedAt: session.startedAt,
      completedAt: session.completedAt,
    };
  }

  /**
   * Complete or abandon a session
   */
  async completeSession(
    userId: string,
    sessionId: string,
    abandon = false
  ): Promise<QuizResultDto> {
    const session = await this.prisma.quizSession.findUnique({
      where: { id: sessionId },
      include: {
        category: true,
        userAnswers: {
          include: {
            question: true,
          },
        },
      },
    });

    if (!session) {
      throw new NotFoundException(`Quiz session with ID "${sessionId}" not found`);
    }

    if (session.userId !== userId) {
      throw new ForbiddenException("You do not have access to this quiz session");
    }

    if (session.status !== QuizSessionStatus.IN_PROGRESS) {
      throw new BadRequestException(`Session is already ${session.status.toLowerCase()}`);
    }

    // 1. Mark session as COMPLETED or ABANDONED
    const completedAt = new Date();
    const status = abandon ? QuizSessionStatus.ABANDONED : QuizSessionStatus.COMPLETED;

    await this.prisma.quizSession.update({
      where: { id: sessionId },
      data: {
        status,
        completedAt,
      },
    });

    // 2. Calculate statistics
    const totalTimeSpent = session.userAnswers.reduce((sum, a) => sum + a.timeSpent, 0);
    const answeredCount = session.userAnswers.length;
    const accuracy =
      answeredCount > 0 ? Math.round((session.correctAnswers / answeredCount) * 100) : 0;
    const averageTimePerQuestion =
      answeredCount > 0 ? Math.round(totalTimeSpent / answeredCount) : 0;

    // 3. Get all questions for the session to build review
    const questionIds = session.questionIds as string[];
    const questions = await this.prisma.question.findMany({
      where: { id: { in: questionIds } },
    });

    // Create a map for quick lookup
    const questionMap = new Map(questions.map((q) => [q.id, q]));
    const answerMap = new Map(session.userAnswers.map((a) => [a.questionId, a]));

    // Build answer review in order
    const answers: AnswerReviewDto[] = questionIds.map((qId) => {
      const question = questionMap.get(qId);
      const userAnswer = answerMap.get(qId);

      if (!question) {
        throw new Error(`Question ${qId} not found`);
      }

      return {
        questionId: question.id,
        content: question.content,
        type: question.type,
        difficulty: question.difficulty,
        options: question.options as string[],
        selectedAnswer: userAnswer?.selectedAnswer ?? "",
        correctAnswer: question.correctAnswer,
        isCorrect: userAnswer?.isCorrect ?? false,
        explanation: question.explanation,
        pointsEarned: userAnswer?.pointsEarned ?? 0,
        timeSpent: userAnswer?.timeSpent ?? 0,
      };
    });

    this.logger.log(
      `${abandon ? "Abandoned" : "Completed"} quiz session ${sessionId} for user ${userId}: ${session.correctAnswers}/${answeredCount} correct, ${session.score} points`
    );

    // 4. Return final results
    return {
      id: session.id,
      userId: session.userId,
      categoryId: session.categoryId,
      categoryName: session.category.name,
      status,
      score: session.score,
      totalQuestions: session.totalQuestions,
      correctAnswers: session.correctAnswers,
      accuracy,
      totalTimeSpent,
      averageTimePerQuestion,
      answers,
      startedAt: session.startedAt,
      completedAt,
    };
  }

  /**
   * Get session history for user
   */
  async getUserSessions(userId: string, pagination: PaginationDto): Promise<PaginatedSessionsDto> {
    const { page = 1, limit = 20 } = pagination;

    // Get total count
    const total = await this.prisma.quizSession.count({
      where: { userId },
    });

    // Get paginated sessions
    const sessions = await this.prisma.quizSession.findMany({
      where: { userId },
      include: {
        category: true,
        userAnswers: true,
      },
      orderBy: { startedAt: "desc" },
      skip: pagination.skip,
      take: pagination.take,
    });

    const totalPages = Math.ceil(total / limit);

    // Map to summary DTOs
    const data: SessionSummaryDto[] = sessions.map((session) => {
      const answeredCount = session.userAnswers.length;
      const accuracy =
        answeredCount > 0 ? Math.round((session.correctAnswers / answeredCount) * 100) : 0;

      return {
        id: session.id,
        categoryId: session.categoryId,
        categoryName: session.category.name,
        status: session.status,
        score: session.score,
        totalQuestions: session.totalQuestions,
        correctAnswers: session.correctAnswers,
        accuracy,
        startedAt: session.startedAt,
        completedAt: session.completedAt,
      };
    });

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    };
  }

  /**
   * Calculate points with time bonus
   * Base points from question, time bonus: faster = more points (up to 50% bonus)
   */
  private calculatePoints(
    question: Question,
    timeSpent: number,
    isCorrect: boolean
  ): { totalPoints: number; timeBonus: number } {
    if (!isCorrect) {
      return { totalPoints: 0, timeBonus: 0 };
    }

    const basePoints = question.points;
    const timeLimit = question.timeLimit;

    // Time bonus: faster = more points (up to 50% bonus)
    // If user takes 0 seconds, they get 50% bonus
    // If user takes full time, they get 0% bonus
    const timeBonus = Math.max(0, ((timeLimit - timeSpent) / timeLimit) * 0.5);
    const totalPoints = Math.round(basePoints * (1 + timeBonus));

    return { totalPoints, timeBonus };
  }

  /**
   * Convert question to SessionQuestionDto (without correct answer)
   */
  private toSessionQuestionDto(
    question:
      | Question
      | {
          id: string;
          content: string;
          type: QuestionType;
          difficulty: Difficulty;
          options: string[];
          imageUrl: string | null;
          points: number;
          timeLimit: number;
        }
  ): SessionQuestionDto {
    return {
      id: question.id,
      content: question.content,
      type: question.type,
      difficulty: question.difficulty,
      options: question.options as string[],
      imageUrl: question.imageUrl,
      points: question.points,
      timeLimit: question.timeLimit,
    };
  }
}
