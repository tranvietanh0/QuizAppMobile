import { Injectable, NotFoundException, BadRequestException, Logger } from "@nestjs/common";
import { Difficulty, Question } from "@prisma/client";

import { PrismaService } from "../prisma/prisma.service";
import {
  CreateQuestionDto,
  UpdateQuestionDto,
  QuestionFilterDto,
  CategoryQuestionsOptionsDto,
  QuestionResponseDto,
  QuestionPlayResponseDto,
  PaginatedQuestionResponseDto,
  BulkCreateResponseDto,
} from "./dto";

@Injectable()
export class QuestionsService {
  private readonly logger = new Logger(QuestionsService.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Find all questions with pagination and filtering
   */
  async findAll(filter: QuestionFilterDto): Promise<PaginatedQuestionResponseDto> {
    const { categoryId, type, difficulty, isActive, search, page, limit } = filter;

    // Build where clause
    const where: any = {};

    if (categoryId) {
      where.categoryId = categoryId;
    }

    if (type) {
      where.type = type;
    }

    if (difficulty) {
      where.difficulty = difficulty;
    }

    if (isActive !== undefined) {
      where.isActive = isActive;
    }

    if (search) {
      where.content = {
        contains: search,
        mode: "insensitive",
      };
    }

    // Get total count
    const total = await this.prisma.question.count({ where });

    // Get paginated questions
    const questions = await this.prisma.question.findMany({
      where,
      skip: filter.skip,
      take: filter.take,
      orderBy: { createdAt: "desc" },
    });

    const currentPage = page ?? 1;
    const currentLimit = limit ?? 20;
    const totalPages = Math.ceil(total / currentLimit);

    return {
      data: questions.map((q) => this.toQuestionResponse(q)),
      meta: {
        total,
        page: currentPage,
        limit: currentLimit,
        totalPages,
        hasNextPage: currentPage < totalPages,
        hasPreviousPage: currentPage > 1,
      },
    };
  }

  /**
   * Find a question by ID
   */
  async findById(id: string): Promise<QuestionResponseDto> {
    const question = await this.prisma.question.findUnique({
      where: { id },
    });

    if (!question) {
      throw new NotFoundException(`Question with ID "${id}" not found`);
    }

    return this.toQuestionResponse(question);
  }

  /**
   * Find questions by category with optional filtering
   */
  async findByCategory(
    categoryId: string,
    options?: CategoryQuestionsOptionsDto
  ): Promise<QuestionPlayResponseDto[]> {
    // Verify category exists
    const category = await this.prisma.category.findUnique({
      where: { id: categoryId },
    });

    if (!category) {
      throw new NotFoundException(`Category with ID "${categoryId}" not found`);
    }

    const where: any = {
      categoryId,
      isActive: true,
    };

    if (options?.difficulty) {
      where.difficulty = options.difficulty;
    }

    let questions: Question[];

    if (options?.random) {
      // For random selection, we need to use a raw query or fetch all and shuffle
      const allQuestions = await this.prisma.question.findMany({
        where,
      });

      // Shuffle using Fisher-Yates algorithm
      const shuffled = this.shuffleArray([...allQuestions]);
      questions = shuffled.slice(0, options?.limit ?? 20);
    } else {
      questions = await this.prisma.question.findMany({
        where,
        take: options?.limit ?? 20,
        orderBy: { createdAt: "desc" },
      });
    }

    return questions.map((q) => this.toQuestionPlayResponse(q));
  }

  /**
   * Get random questions for quiz session
   */
  async getRandomQuestions(
    categoryId: string,
    count: number,
    difficulty?: Difficulty
  ): Promise<QuestionPlayResponseDto[]> {
    // Verify category exists
    const category = await this.prisma.category.findUnique({
      where: { id: categoryId },
    });

    if (!category) {
      throw new NotFoundException(`Category with ID "${categoryId}" not found`);
    }

    const where: any = {
      categoryId,
      isActive: true,
    };

    if (difficulty) {
      where.difficulty = difficulty;
    }

    // Get all matching questions
    const allQuestions = await this.prisma.question.findMany({
      where,
    });

    if (allQuestions.length === 0) {
      return [];
    }

    // Shuffle and take requested count
    const shuffled = this.shuffleArray([...allQuestions]);
    const selected = shuffled.slice(0, Math.min(count, shuffled.length));

    this.logger.log(`Selected ${selected.length} random questions for category ${categoryId}`);

    return selected.map((q) => this.toQuestionPlayResponse(q));
  }

  /**
   * Create a new question
   */
  async create(data: CreateQuestionDto): Promise<QuestionResponseDto> {
    // Verify category exists
    const category = await this.prisma.category.findUnique({
      where: { id: data.categoryId },
    });

    if (!category) {
      throw new NotFoundException(`Category with ID "${data.categoryId}" not found`);
    }

    // Create the question
    const question = await this.prisma.question.create({
      data: {
        categoryId: data.categoryId,
        content: data.content,
        type: data.type,
        difficulty: data.difficulty,
        options: data.options,
        correctAnswer: data.correctAnswer,
        explanation: data.explanation,
        imageUrl: data.imageUrl,
        points: data.points,
        timeLimit: data.timeLimit,
      },
    });

    // Update category question count
    await this.prisma.category.update({
      where: { id: data.categoryId },
      data: {
        questionCount: {
          increment: 1,
        },
      },
    });

    this.logger.log(`Created question: ${question.id}`);

    return this.toQuestionResponse(question);
  }

  /**
   * Update a question
   */
  async update(id: string, data: UpdateQuestionDto): Promise<QuestionResponseDto> {
    // Find existing question
    const existingQuestion = await this.prisma.question.findUnique({
      where: { id },
    });

    if (!existingQuestion) {
      throw new NotFoundException(`Question with ID "${id}" not found`);
    }

    // If categoryId is being updated, verify new category exists
    if (data.categoryId && data.categoryId !== existingQuestion.categoryId) {
      const category = await this.prisma.category.findUnique({
        where: { id: data.categoryId },
      });

      if (!category) {
        throw new NotFoundException(`Category with ID "${data.categoryId}" not found`);
      }
    }

    // Validate correctAnswer against options
    const finalOptions = data.options ?? (existingQuestion.options as string[]);
    const finalCorrectAnswer = data.correctAnswer ?? existingQuestion.correctAnswer;

    if (!finalOptions.includes(finalCorrectAnswer)) {
      throw new BadRequestException("correctAnswer must be one of the values in the options array");
    }

    // Update the question
    const question = await this.prisma.question.update({
      where: { id },
      data: {
        categoryId: data.categoryId,
        content: data.content,
        type: data.type,
        difficulty: data.difficulty,
        options: data.options,
        correctAnswer: data.correctAnswer,
        explanation: data.explanation,
        imageUrl: data.imageUrl,
        points: data.points,
        timeLimit: data.timeLimit,
        isActive: data.isActive,
      },
    });

    // Update category question counts if category changed
    if (data.categoryId && data.categoryId !== existingQuestion.categoryId) {
      await Promise.all([
        this.prisma.category.update({
          where: { id: existingQuestion.categoryId },
          data: { questionCount: { decrement: 1 } },
        }),
        this.prisma.category.update({
          where: { id: data.categoryId },
          data: { questionCount: { increment: 1 } },
        }),
      ]);
    }

    this.logger.log(`Updated question: ${question.id}`);

    return this.toQuestionResponse(question);
  }

  /**
   * Soft delete a question (sets isActive to false)
   */
  async delete(id: string): Promise<{ id: string; message: string }> {
    const question = await this.prisma.question.findUnique({
      where: { id },
    });

    if (!question) {
      throw new NotFoundException(`Question with ID "${id}" not found`);
    }

    // Soft delete by setting isActive to false
    await this.prisma.question.update({
      where: { id },
      data: { isActive: false },
    });

    // Update category question count
    if (question.isActive) {
      await this.prisma.category.update({
        where: { id: question.categoryId },
        data: {
          questionCount: {
            decrement: 1,
          },
        },
      });
    }

    this.logger.log(`Soft deleted question: ${id}`);

    return {
      id,
      message: "Question deleted successfully",
    };
  }

  /**
   * Bulk create questions
   */
  async bulkCreate(questions: CreateQuestionDto[]): Promise<BulkCreateResponseDto> {
    if (!questions || questions.length === 0) {
      throw new BadRequestException("No questions provided for bulk creation");
    }

    // Validate all categories exist
    const categoryIds = [...new Set(questions.map((q) => q.categoryId))];
    const existingCategories = await this.prisma.category.findMany({
      where: { id: { in: categoryIds } },
      select: { id: true },
    });

    const existingCategoryIds = new Set(existingCategories.map((c) => c.id));
    const missingCategories = categoryIds.filter((id) => !existingCategoryIds.has(id));

    if (missingCategories.length > 0) {
      throw new BadRequestException(`Categories not found: ${missingCategories.join(", ")}`);
    }

    // Create questions in a transaction
    const createdQuestions = await this.prisma.$transaction(async (tx) => {
      const results: Question[] = [];

      for (const questionData of questions) {
        const question = await tx.question.create({
          data: {
            categoryId: questionData.categoryId,
            content: questionData.content,
            type: questionData.type,
            difficulty: questionData.difficulty,
            options: questionData.options,
            correctAnswer: questionData.correctAnswer,
            explanation: questionData.explanation,
            imageUrl: questionData.imageUrl,
            points: questionData.points,
            timeLimit: questionData.timeLimit,
          },
        });
        results.push(question);
      }

      // Update category question counts
      const categoryCountMap = new Map<string, number>();
      for (const q of questions) {
        const current = categoryCountMap.get(q.categoryId) ?? 0;
        categoryCountMap.set(q.categoryId, current + 1);
      }

      for (const [categoryId, count] of categoryCountMap.entries()) {
        await tx.category.update({
          where: { id: categoryId },
          data: { questionCount: { increment: count } },
        });
      }

      return results;
    });

    this.logger.log(`Bulk created ${createdQuestions.length} questions`);

    return {
      created: createdQuestions.length,
      questions: createdQuestions.map((q) => this.toQuestionResponse(q)),
    };
  }

  /**
   * Convert Question entity to QuestionResponseDto
   */
  private toQuestionResponse(question: Question): QuestionResponseDto {
    return {
      id: question.id,
      categoryId: question.categoryId,
      content: question.content,
      type: question.type,
      difficulty: question.difficulty,
      options: question.options as string[],
      correctAnswer: question.correctAnswer,
      explanation: question.explanation,
      imageUrl: question.imageUrl,
      points: question.points,
      timeLimit: question.timeLimit,
      isActive: question.isActive,
      createdAt: question.createdAt,
      updatedAt: question.updatedAt,
    };
  }

  /**
   * Convert Question entity to QuestionPlayResponseDto (without correctAnswer)
   */
  private toQuestionPlayResponse(question: Question): QuestionPlayResponseDto {
    return {
      id: question.id,
      categoryId: question.categoryId,
      content: question.content,
      type: question.type,
      difficulty: question.difficulty,
      options: question.options as string[],
      imageUrl: question.imageUrl,
      points: question.points,
      timeLimit: question.timeLimit,
    };
  }

  /**
   * Fisher-Yates shuffle algorithm
   */
  private shuffleArray<T>(array: T[]): T[] {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }
}
