import { Controller, Get, Post, Body, Param, Query, HttpStatus } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBearerAuth } from "@nestjs/swagger";

import { QuizSessionsService } from "./quiz-sessions.service";
import { CurrentUser } from "../common/decorators";
import { PaginationDto } from "../common/dto";
import {
  StartQuizDto,
  SubmitAnswerDto,
  QuizSessionResponseDto,
  AnswerResultDto,
  QuizResultDto,
  PaginatedSessionsDto,
} from "./dto";

@ApiTags("Quiz Sessions")
@ApiBearerAuth()
@Controller("quiz")
export class QuizSessionsController {
  constructor(private readonly quizSessionsService: QuizSessionsService) {}

  @Post("start")
  @ApiOperation({
    summary: "Start a new quiz session",
    description:
      "Create a new quiz session with random questions from the specified category. Returns the session with questions (without correct answers).",
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: "Quiz session started successfully",
    type: QuizSessionResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: "No questions available for the category/difficulty",
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "Category not found",
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: "Unauthorized - JWT token required",
  })
  async startSession(
    @CurrentUser("id") userId: string,
    @Body() startQuizDto: StartQuizDto
  ): Promise<QuizSessionResponseDto> {
    return this.quizSessionsService.startSession(userId, startQuizDto);
  }

  @Post("answer")
  @ApiOperation({
    summary: "Submit an answer",
    description:
      "Submit an answer for a question in the current quiz session. Returns whether the answer was correct, the correct answer, explanation, and points earned.",
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Answer submitted successfully",
    type: AnswerResultDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description:
      "Invalid answer submission (session not in progress, question already answered, or question not in session)",
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "Session or question not found",
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: "User does not own this session",
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: "Unauthorized - JWT token required",
  })
  async submitAnswer(
    @CurrentUser("id") userId: string,
    @Body() submitAnswerDto: SubmitAnswerDto
  ): Promise<AnswerResultDto> {
    return this.quizSessionsService.submitAnswer(userId, submitAnswerDto);
  }

  @Get("session/:id")
  @ApiOperation({
    summary: "Get current session state",
    description:
      "Retrieve the current state of a quiz session, including questions and progress. Questions do not include correct answers.",
  })
  @ApiParam({
    name: "id",
    description: "Quiz session ID",
    example: "clxxxxxxxxxxxxxxxxx",
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Session retrieved successfully",
    type: QuizSessionResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "Session not found",
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: "User does not own this session",
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: "Unauthorized - JWT token required",
  })
  async getSession(
    @CurrentUser("id") userId: string,
    @Param("id") sessionId: string
  ): Promise<QuizSessionResponseDto> {
    return this.quizSessionsService.getSession(userId, sessionId);
  }

  @Post("session/:id/complete")
  @ApiOperation({
    summary: "Complete a quiz session",
    description:
      "Mark the quiz session as completed and get the final results with all answers reviewed.",
  })
  @ApiParam({
    name: "id",
    description: "Quiz session ID",
    example: "clxxxxxxxxxxxxxxxxx",
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Session completed successfully",
    type: QuizResultDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: "Session is not in progress",
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "Session not found",
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: "User does not own this session",
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: "Unauthorized - JWT token required",
  })
  async completeSession(
    @CurrentUser("id") userId: string,
    @Param("id") sessionId: string
  ): Promise<QuizResultDto> {
    return this.quizSessionsService.completeSession(userId, sessionId, false);
  }

  @Post("session/:id/abandon")
  @ApiOperation({
    summary: "Abandon a quiz session",
    description:
      "Mark the quiz session as abandoned and get the final results with all answers reviewed.",
  })
  @ApiParam({
    name: "id",
    description: "Quiz session ID",
    example: "clxxxxxxxxxxxxxxxxx",
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Session abandoned successfully",
    type: QuizResultDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: "Session is not in progress",
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "Session not found",
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: "User does not own this session",
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: "Unauthorized - JWT token required",
  })
  async abandonSession(
    @CurrentUser("id") userId: string,
    @Param("id") sessionId: string
  ): Promise<QuizResultDto> {
    return this.quizSessionsService.completeSession(userId, sessionId, true);
  }

  @Get("history")
  @ApiOperation({
    summary: "Get user's quiz history",
    description:
      "Retrieve a paginated list of all quiz sessions for the authenticated user, sorted by most recent first.",
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Quiz history retrieved successfully",
    type: PaginatedSessionsDto,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: "Unauthorized - JWT token required",
  })
  async getUserHistory(
    @CurrentUser("id") userId: string,
    @Query() pagination: PaginationDto
  ): Promise<PaginatedSessionsDto> {
    return this.quizSessionsService.getUserSessions(userId, pagination);
  }
}
