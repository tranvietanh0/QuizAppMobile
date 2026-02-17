import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
} from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBearerAuth } from "@nestjs/swagger";
import { Difficulty } from "@prisma/client";

import { QuestionsService } from "./questions.service";
import {
  CreateQuestionDto,
  UpdateQuestionDto,
  QuestionFilterDto,
  CategoryQuestionsOptionsDto,
  QuestionResponseDto,
  QuestionPlayResponseDto,
  PaginatedQuestionResponseDto,
  BulkCreateResponseDto,
  DeleteQuestionResponseDto,
} from "./dto";

@ApiTags("Questions")
@ApiBearerAuth()
@Controller("questions")
export class QuestionsController {
  constructor(private readonly questionsService: QuestionsService) {}

  @Get()
  @ApiOperation({
    summary: "List questions",
    description: "Get a paginated list of questions with optional filtering",
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Questions retrieved successfully",
    type: PaginatedQuestionResponseDto,
  })
  async findAll(@Query() filter: QuestionFilterDto): Promise<PaginatedQuestionResponseDto> {
    return this.questionsService.findAll(filter);
  }

  @Get(":id")
  @ApiOperation({
    summary: "Get question by ID",
    description: "Retrieve a single question by its ID (includes correct answer)",
  })
  @ApiParam({
    name: "id",
    description: "Question ID",
    example: "clxxxxxxxxxxxxxxxxx",
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Question retrieved successfully",
    type: QuestionResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "Question not found",
  })
  async findById(@Param("id") id: string): Promise<QuestionResponseDto> {
    return this.questionsService.findById(id);
  }

  @Get("category/:categoryId")
  @ApiOperation({
    summary: "Get questions by category",
    description: "Get questions for a specific category (play mode - no correct answers)",
  })
  @ApiParam({
    name: "categoryId",
    description: "Category ID",
    example: "clxxxxxxxxxxxxxxxxx",
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Questions retrieved successfully",
    type: [QuestionPlayResponseDto],
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "Category not found",
  })
  async findByCategory(
    @Param("categoryId") categoryId: string,
    @Query() options: CategoryQuestionsOptionsDto
  ): Promise<QuestionPlayResponseDto[]> {
    return this.questionsService.findByCategory(categoryId, options);
  }

  @Get("category/:categoryId/random")
  @ApiOperation({
    summary: "Get random questions for quiz",
    description:
      "Get random questions from a category for quiz session (play mode - no correct answers)",
  })
  @ApiParam({
    name: "categoryId",
    description: "Category ID",
    example: "clxxxxxxxxxxxxxxxxx",
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Random questions retrieved successfully",
    type: [QuestionPlayResponseDto],
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "Category not found",
  })
  async getRandomQuestions(
    @Param("categoryId") categoryId: string,
    @Query("count") count: number = 10,
    @Query("difficulty") difficulty?: Difficulty
  ): Promise<QuestionPlayResponseDto[]> {
    return this.questionsService.getRandomQuestions(categoryId, count, difficulty);
  }

  @Post()
  @ApiOperation({
    summary: "Create question",
    description: "Create a new question",
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: "Question created successfully",
    type: QuestionResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: "Validation error",
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "Category not found",
  })
  async create(@Body() createQuestionDto: CreateQuestionDto): Promise<QuestionResponseDto> {
    return this.questionsService.create(createQuestionDto);
  }

  @Post("bulk")
  @ApiOperation({
    summary: "Bulk create questions",
    description: "Create multiple questions at once",
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: "Questions created successfully",
    type: BulkCreateResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: "Validation error or category not found",
  })
  async bulkCreate(@Body() questions: CreateQuestionDto[]): Promise<BulkCreateResponseDto> {
    return this.questionsService.bulkCreate(questions);
  }

  @Patch(":id")
  @ApiOperation({
    summary: "Update question",
    description: "Update an existing question",
  })
  @ApiParam({
    name: "id",
    description: "Question ID",
    example: "clxxxxxxxxxxxxxxxxx",
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Question updated successfully",
    type: QuestionResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "Question or category not found",
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: "Validation error",
  })
  async update(
    @Param("id") id: string,
    @Body() updateQuestionDto: UpdateQuestionDto
  ): Promise<QuestionResponseDto> {
    return this.questionsService.update(id, updateQuestionDto);
  }

  @Delete(":id")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: "Delete question",
    description: "Soft delete a question (sets isActive to false)",
  })
  @ApiParam({
    name: "id",
    description: "Question ID",
    example: "clxxxxxxxxxxxxxxxxx",
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Question deleted successfully",
    type: DeleteQuestionResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "Question not found",
  })
  async delete(@Param("id") id: string): Promise<DeleteQuestionResponseDto> {
    return this.questionsService.delete(id);
  }
}
