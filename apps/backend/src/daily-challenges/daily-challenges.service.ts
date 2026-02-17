import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
  Logger,
} from "@nestjs/common";
import { Difficulty, Question } from "@prisma/client";

import { PrismaService } from "../prisma/prisma.service";
import {
  DailyChallengeWithStatusDto,
  DailyChallengeAttemptDto,
  DailyChallengeQuestionDto,
  StartAttemptResponseDto,
  CompleteAttemptDto,
  DailyChallengeResultDto,
  AnswerResultDto,
  UserStreakDto,
  DailyChallengeStatusDto,
} from "./dto";

// Streak bonus tiers
const STREAK_BONUSES = [
  { minDays: 30, multiplier: 2.0, description: "30+ days: 100% bonus" },
  { minDays: 14, multiplier: 1.5, description: "14+ days: 50% bonus" },
  { minDays: 7, multiplier: 1.25, description: "7+ days: 25% bonus" },
  { minDays: 3, multiplier: 1.1, description: "3+ days: 10% bonus" },
  { minDays: 0, multiplier: 1.0, description: "No bonus" },
];

@Injectable()
export class DailyChallengesService {
  private readonly logger = new Logger(DailyChallengesService.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Get today's date as a string in YYYY-MM-DD format
   */
  private getTodayDateString(): string {
    return new Date().toISOString().split("T")[0];
  }

  /**
   * Get yesterday's date as a string in YYYY-MM-DD format
   */
  private getYesterdayDateString(): string {
    const yesterday = new Date(Date.now() - 86400000);
    return yesterday.toISOString().split("T")[0];
  }

  /**
   * Convert date to start of day Date object
   */
  private toStartOfDay(dateString: string): Date {
    return new Date(`${dateString}T00:00:00.000Z`);
  }

  /**
   * Get the streak bonus for a given streak count
   */
  private getStreakBonus(streakDays: number): {
    multiplier: number;
    description: string;
    daysToNext: number;
  } {
    for (let i = 0; i < STREAK_BONUSES.length; i++) {
      const tier = STREAK_BONUSES[i];
      if (streakDays >= tier.minDays) {
        // Calculate days to next tier
        const nextTier = i > 0 ? STREAK_BONUSES[i - 1] : null;
        const daysToNext = nextTier ? nextTier.minDays - streakDays : 0;

        return {
          multiplier: tier.multiplier,
          description: tier.description,
          daysToNext: Math.max(0, daysToNext),
        };
      }
    }

    return { multiplier: 1.0, description: "No bonus", daysToNext: 3 };
  }

  /**
   * Get or create today's daily challenge
   */
  async getTodayChallenge(userId?: string): Promise<DailyChallengeWithStatusDto> {
    const today = this.getTodayDateString();
    let challenge = await this.findChallengeByDate(today);

    if (!challenge) {
      challenge = await this.createDailyChallenge(today);
    }

    // Get user's attempt status if userId is provided
    let completed = false;
    let userScore: number | undefined;
    let userCorrectAnswers: number | undefined;

    if (userId) {
      const attempt = await this.prisma.dailyChallengeAttempt.findUnique({
        where: {
          challengeId_userId: {
            challengeId: challenge.id,
            userId,
          },
        },
      });

      if (attempt?.completedAt) {
        completed = true;
        userScore = attempt.score;
        userCorrectAnswers = attempt.correctAnswers;
      }
    }

    return {
      id: challenge.id,
      date: today,
      categoryId: challenge.categoryId,
      categoryName: challenge.category.name,
      categoryColor: challenge.category.color,
      difficulty: challenge.difficulty,
      questionCount: challenge.questionCount,
      rewardPoints: challenge.rewardPoints,
      createdAt: challenge.createdAt,
      completed,
      userScore,
      userCorrectAnswers,
    };
  }

  /**
   * Find a daily challenge by date
   */
  private async findChallengeByDate(dateString: string) {
    const date = this.toStartOfDay(dateString);

    return this.prisma.dailyChallenge.findUnique({
      where: { date },
      include: {
        category: true,
      },
    });
  }

  /**
   * Create a new daily challenge for a given date
   */
  private async createDailyChallenge(dateString: string) {
    const date = this.toStartOfDay(dateString);

    // Get all active categories with enough questions
    const categories = await this.prisma.category.findMany({
      where: {
        isActive: true,
        questionCount: { gte: 10 },
      },
    });

    if (categories.length === 0) {
      throw new NotFoundException(
        "No categories with enough questions available for daily challenge"
      );
    }

    // Pick a random category
    const randomCategory = categories[Math.floor(Math.random() * categories.length)];

    // Pick a random difficulty
    const difficulties: Difficulty[] = ["EASY", "MEDIUM", "HARD"];
    const randomDifficulty = difficulties[Math.floor(Math.random() * difficulties.length)];

    // Get random questions from the category
    const questions = await this.prisma.question.findMany({
      where: {
        categoryId: randomCategory.id,
        isActive: true,
        difficulty: randomDifficulty,
      },
    });

    // If not enough questions with the exact difficulty, fall back to any difficulty
    let selectedQuestions: Question[];
    if (questions.length < 10) {
      const allQuestions = await this.prisma.question.findMany({
        where: {
          categoryId: randomCategory.id,
          isActive: true,
        },
      });
      selectedQuestions = this.shuffleArray([...allQuestions]).slice(0, 10);
    } else {
      selectedQuestions = this.shuffleArray([...questions]).slice(0, 10);
    }

    const questionIds = selectedQuestions.map((q) => q.id);

    // Create the daily challenge
    const challenge = await this.prisma.dailyChallenge.create({
      data: {
        date,
        categoryId: randomCategory.id,
        difficulty: randomDifficulty,
        questionCount: questionIds.length,
        questionIds,
        rewardPoints: 100,
      },
      include: {
        category: true,
      },
    });

    this.logger.log(
      `Created daily challenge for ${dateString}: category=${randomCategory.name}, difficulty=${randomDifficulty}`
    );

    return challenge;
  }

  /**
   * Start a daily challenge attempt for a user
   */
  async startAttempt(userId: string): Promise<StartAttemptResponseDto> {
    const today = this.getTodayDateString();
    const challenge = await this.findChallengeByDate(today);

    if (!challenge) {
      throw new NotFoundException("Today's daily challenge not found");
    }

    // Check if user already has an attempt
    const existingAttempt = await this.prisma.dailyChallengeAttempt.findUnique({
      where: {
        challengeId_userId: {
          challengeId: challenge.id,
          userId,
        },
      },
    });

    if (existingAttempt?.completedAt) {
      throw new ConflictException("You have already completed today's daily challenge");
    }

    // Create or get existing attempt
    let attempt = existingAttempt;
    if (!attempt) {
      attempt = await this.prisma.dailyChallengeAttempt.create({
        data: {
          challengeId: challenge.id,
          userId,
        },
      });
      this.logger.log(`User ${userId} started daily challenge attempt ${attempt.id}`);
    }

    // Get the questions (without correct answers)
    const questionIds = challenge.questionIds as string[];
    const questions = await this.prisma.question.findMany({
      where: {
        id: { in: questionIds },
      },
    });

    // Sort questions in the order they were selected
    const questionMap = new Map(questions.map((q) => [q.id, q]));
    const orderedQuestions = questionIds
      .map((id) => questionMap.get(id))
      .filter((q): q is Question => q !== undefined);

    const questionsDto: DailyChallengeQuestionDto[] = orderedQuestions.map((q) => ({
      id: q.id,
      content: q.content,
      type: q.type,
      difficulty: q.difficulty,
      options: q.options as string[],
      imageUrl: q.imageUrl,
      points: q.points,
      timeLimit: q.timeLimit,
    }));

    const attemptDto: DailyChallengeAttemptDto = {
      id: attempt.id,
      challengeId: attempt.challengeId,
      userId: attempt.userId,
      score: attempt.score,
      correctAnswers: attempt.correctAnswers,
      completedAt: attempt.completedAt,
      createdAt: attempt.createdAt,
    };

    return {
      attempt: attemptDto,
      questions: questionsDto,
    };
  }

  /**
   * Complete a daily challenge attempt
   */
  async completeAttempt(
    userId: string,
    data: CompleteAttemptDto
  ): Promise<DailyChallengeResultDto> {
    const { attemptId, answers } = data;

    // Find the attempt
    const attempt = await this.prisma.dailyChallengeAttempt.findUnique({
      where: { id: attemptId },
      include: {
        challenge: true,
      },
    });

    if (!attempt) {
      throw new NotFoundException(`Attempt with ID "${attemptId}" not found`);
    }

    if (attempt.userId !== userId) {
      throw new BadRequestException("You can only complete your own attempts");
    }

    if (attempt.completedAt) {
      throw new ConflictException("This attempt has already been completed");
    }

    // Get all questions for the challenge
    const questionIds = attempt.challenge.questionIds as string[];
    const questions = await this.prisma.question.findMany({
      where: {
        id: { in: questionIds },
      },
    });

    const questionMap = new Map(questions.map((q) => [q.id, q]));

    // Process answers and calculate score
    let correctCount = 0;
    let basePoints = 0;
    const answerResults: AnswerResultDto[] = [];

    for (const answer of answers) {
      const question = questionMap.get(answer.questionId);
      if (!question) {
        continue;
      }

      const isCorrect = answer.selectedAnswer === question.correctAnswer;
      const pointsEarned = isCorrect ? question.points : 0;

      if (isCorrect) {
        correctCount++;
        basePoints += pointsEarned;
      }

      answerResults.push({
        questionId: answer.questionId,
        isCorrect,
        correctAnswer: question.correctAnswer,
        selectedAnswer: answer.selectedAnswer,
        pointsEarned,
        explanation: question.explanation,
      });
    }

    // Update user streak
    const streak = await this.updateStreak(userId);
    const streakBonus = this.getStreakBonus(streak.currentStreak);
    const streakBonusPoints = Math.floor(basePoints * (streakBonus.multiplier - 1));
    const totalScore = basePoints + streakBonusPoints;

    // Check if this is a new record
    const wasNewRecord = streak.currentStreak > streak.longestStreak;
    const longestStreak = Math.max(streak.currentStreak, streak.longestStreak);

    // Update the attempt
    await this.prisma.dailyChallengeAttempt.update({
      where: { id: attemptId },
      data: {
        score: totalScore,
        correctAnswers: correctCount,
        completedAt: new Date(),
      },
    });

    this.logger.log(
      `User ${userId} completed daily challenge: score=${totalScore}, correct=${correctCount}/${questionIds.length}`
    );

    return {
      score: totalScore,
      correctAnswers: correctCount,
      totalQuestions: questionIds.length,
      basePoints,
      streakMultiplier: streakBonus.multiplier,
      streakBonus: streakBonusPoints,
      currentStreak: streak.currentStreak,
      longestStreak,
      answerResults,
      isNewRecord: wasNewRecord,
    };
  }

  /**
   * Update user's streak after completing a daily challenge
   */
  private async updateStreak(userId: string) {
    const today = this.getTodayDateString();
    const yesterday = this.getYesterdayDateString();

    // Get or create streak record
    let streak = await this.prisma.userStreak.findUnique({
      where: { userId },
    });

    if (!streak) {
      streak = await this.prisma.userStreak.create({
        data: {
          userId,
          currentStreak: 1,
          longestStreak: 1,
          lastPlayedDate: this.toStartOfDay(today),
        },
      });
      this.logger.log(`Created new streak record for user ${userId}`);
      return streak;
    }

    // Check last played date
    const lastPlayedStr = streak.lastPlayedDate
      ? streak.lastPlayedDate.toISOString().split("T")[0]
      : null;

    if (lastPlayedStr === today) {
      // Already played today, no change to streak
      return streak;
    }

    let newStreak: number;
    if (lastPlayedStr === yesterday) {
      // Continuing the streak
      newStreak = streak.currentStreak + 1;
    } else {
      // Streak broken, start fresh
      newStreak = 1;
    }

    const newLongestStreak = Math.max(streak.longestStreak, newStreak);

    streak = await this.prisma.userStreak.update({
      where: { userId },
      data: {
        currentStreak: newStreak,
        longestStreak: newLongestStreak,
        lastPlayedDate: this.toStartOfDay(today),
      },
    });

    this.logger.log(
      `Updated streak for user ${userId}: current=${newStreak}, longest=${newLongestStreak}`
    );

    return streak;
  }

  /**
   * Get user's streak information
   */
  async getUserStreak(userId: string): Promise<UserStreakDto> {
    let streak = await this.prisma.userStreak.findUnique({
      where: { userId },
    });

    if (!streak) {
      // Create a new streak record with 0 streak
      streak = await this.prisma.userStreak.create({
        data: {
          userId,
          currentStreak: 0,
          longestStreak: 0,
        },
      });
    }

    // Check if streak is still valid (played yesterday or today)
    const today = this.getTodayDateString();
    const yesterday = this.getYesterdayDateString();
    const lastPlayedStr = streak.lastPlayedDate
      ? streak.lastPlayedDate.toISOString().split("T")[0]
      : null;

    let effectiveStreak = streak.currentStreak;
    if (lastPlayedStr && lastPlayedStr !== today && lastPlayedStr !== yesterday) {
      // Streak has expired
      effectiveStreak = 0;
    }

    const streakBonus = this.getStreakBonus(effectiveStreak);

    return {
      id: streak.id,
      userId: streak.userId,
      currentStreak: effectiveStreak,
      longestStreak: streak.longestStreak,
      lastPlayedDate: lastPlayedStr,
      currentMultiplier: streakBonus.multiplier,
      bonusTier: streakBonus.description,
      daysToNextTier: streakBonus.daysToNext,
      updatedAt: streak.updatedAt,
    };
  }

  /**
   * Check if user has completed today's challenge
   */
  async hasCompletedToday(userId: string): Promise<boolean> {
    const today = this.getTodayDateString();
    const challenge = await this.findChallengeByDate(today);

    if (!challenge) {
      return false;
    }

    const attempt = await this.prisma.dailyChallengeAttempt.findUnique({
      where: {
        challengeId_userId: {
          challengeId: challenge.id,
          userId,
        },
      },
    });

    return !!attempt?.completedAt;
  }

  /**
   * Get daily challenge status for a user
   */
  async getDailyChallengeStatus(userId: string): Promise<DailyChallengeStatusDto> {
    const today = this.getTodayDateString();
    const challenge = await this.findChallengeByDate(today);
    const streak = await this.getUserStreak(userId);

    if (!challenge) {
      return {
        completedToday: false,
        streak,
      };
    }

    const attempt = await this.prisma.dailyChallengeAttempt.findUnique({
      where: {
        challengeId_userId: {
          challengeId: challenge.id,
          userId,
        },
      },
    });

    if (attempt?.completedAt) {
      return {
        completedToday: true,
        score: attempt.score,
        correctAnswers: attempt.correctAnswers,
        completedAt: attempt.completedAt,
        streak,
      };
    }

    return {
      completedToday: false,
      streak,
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
