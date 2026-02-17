import {
  Injectable,
  NotFoundException,
  ConflictException,
  UnauthorizedException,
  BadRequestException,
  Logger,
} from "@nestjs/common";
import * as bcrypt from "bcryptjs";

import { PrismaService } from "../prisma/prisma.service";
import { UpdateProfileDto, UserProfileResponseDto, UserStatsResponseDto } from "./dto";

const BCRYPT_SALT_ROUNDS = 12;

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Find a user by ID
   */
  async findById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        username: true,
        displayName: true,
        avatarUrl: true,
        isEmailVerified: true,
        createdAt: true,
        updatedAt: true,
        lastLoginAt: true,
      },
    });

    if (!user) {
      throw new NotFoundException("User not found");
    }

    return user;
  }

  /**
   * Find a user by email
   */
  async findByEmail(email: string) {
    const user = await this.prisma.user.findUnique({
      where: { email: email.toLowerCase() },
      select: {
        id: true,
        email: true,
        username: true,
        displayName: true,
        avatarUrl: true,
        isEmailVerified: true,
        createdAt: true,
        updatedAt: true,
        lastLoginAt: true,
      },
    });

    if (!user) {
      throw new NotFoundException("User not found");
    }

    return user;
  }

  /**
   * Get user profile with full details
   */
  async getProfile(userId: string): Promise<UserProfileResponseDto> {
    const user = await this.findById(userId);
    return user;
  }

  /**
   * Update user profile
   */
  async updateProfile(userId: string, data: UpdateProfileDto): Promise<UserProfileResponseDto> {
    // If username is being updated, check for uniqueness
    if (data.username) {
      const existingUser = await this.prisma.user.findUnique({
        where: { username: data.username.toLowerCase() },
      });

      if (existingUser && existingUser.id !== userId) {
        throw new ConflictException("Username is already taken");
      }
    }

    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: {
        ...(data.displayName && { displayName: data.displayName }),
        ...(data.username && { username: data.username.toLowerCase() }),
      },
      select: {
        id: true,
        email: true,
        username: true,
        displayName: true,
        avatarUrl: true,
        isEmailVerified: true,
        createdAt: true,
        updatedAt: true,
        lastLoginAt: true,
      },
    });

    this.logger.log(`Profile updated for user: ${updatedUser.email}`);

    return updatedUser;
  }

  /**
   * Update user avatar
   */
  async updateAvatar(userId: string, avatarUrl: string): Promise<UserProfileResponseDto> {
    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: { avatarUrl },
      select: {
        id: true,
        email: true,
        username: true,
        displayName: true,
        avatarUrl: true,
        isEmailVerified: true,
        createdAt: true,
        updatedAt: true,
        lastLoginAt: true,
      },
    });

    this.logger.log(`Avatar updated for user: ${updatedUser.email}`);

    return updatedUser;
  }

  /**
   * Get user statistics
   */
  async getUserStats(userId: string): Promise<UserStatsResponseDto> {
    // Verify user exists
    await this.findById(userId);

    // Get completed quiz sessions for this user
    const sessions = await this.prisma.quizSession.findMany({
      where: {
        userId,
        status: "COMPLETED",
      },
      select: {
        id: true,
        score: true,
        correctAnswers: true,
        totalQuestions: true,
        startedAt: true,
        completedAt: true,
      },
      orderBy: {
        completedAt: "desc",
      },
    });

    // Calculate statistics
    const totalGamesPlayed = sessions.length;
    const totalScore = sessions.reduce((sum, session) => sum + session.score, 0);
    const totalCorrectAnswers = sessions.reduce((sum, session) => sum + session.correctAnswers, 0);
    const totalQuestions = sessions.reduce((sum, session) => sum + session.totalQuestions, 0);

    const accuracy =
      totalQuestions > 0 ? Math.round((totalCorrectAnswers / totalQuestions) * 10000) / 100 : 0;

    const averageScore =
      totalGamesPlayed > 0 ? Math.round((totalScore / totalGamesPlayed) * 100) / 100 : 0;

    const bestScore = sessions.length > 0 ? Math.max(...sessions.map((s) => s.score)) : 0;

    // Calculate streaks based on distinct days played
    const { currentStreak, longestStreak } = this.calculateStreaks(sessions);

    return {
      totalGamesPlayed,
      totalScore,
      totalCorrectAnswers,
      totalQuestions,
      accuracy,
      averageScore,
      bestScore,
      currentStreak,
      longestStreak,
    };
  }

  /**
   * Calculate playing streaks
   */
  private calculateStreaks(sessions: { completedAt: Date | null }[]): {
    currentStreak: number;
    longestStreak: number;
  } {
    if (sessions.length === 0) {
      return { currentStreak: 0, longestStreak: 0 };
    }

    // Get unique dates when user played (in local date format)
    const playDates = new Set<string>();
    sessions.forEach((session) => {
      if (session.completedAt) {
        const dateStr = session.completedAt.toISOString().split("T")[0];
        playDates.add(dateStr);
      }
    });

    const sortedDates = Array.from(playDates).sort().reverse();

    if (sortedDates.length === 0) {
      return { currentStreak: 0, longestStreak: 0 };
    }

    // Calculate current streak
    const today = new Date().toISOString().split("T")[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];

    let currentStreak = 0;
    let checkDate: string;

    // Check if played today or yesterday to start counting
    if (sortedDates[0] === today || sortedDates[0] === yesterday) {
      checkDate = sortedDates[0];
      currentStreak = 1;

      for (let i = 1; i < sortedDates.length; i++) {
        const prevDate = new Date(checkDate);
        prevDate.setDate(prevDate.getDate() - 1);
        const expectedPrevDateStr = prevDate.toISOString().split("T")[0];

        if (sortedDates[i] === expectedPrevDateStr) {
          currentStreak++;
          checkDate = sortedDates[i];
        } else {
          break;
        }
      }
    }

    // Calculate longest streak
    let longestStreak = 0;
    let tempStreak = 1;

    // Sort dates in ascending order for longest streak calculation
    const ascendingDates = [...sortedDates].reverse();

    for (let i = 1; i < ascendingDates.length; i++) {
      const prevDate = new Date(ascendingDates[i - 1]);
      prevDate.setDate(prevDate.getDate() + 1);
      const expectedNextDateStr = prevDate.toISOString().split("T")[0];

      if (ascendingDates[i] === expectedNextDateStr) {
        tempStreak++;
      } else {
        longestStreak = Math.max(longestStreak, tempStreak);
        tempStreak = 1;
      }
    }
    longestStreak = Math.max(longestStreak, tempStreak);

    return { currentStreak, longestStreak };
  }

  /**
   * Change user password
   */
  async changePassword(userId: string, oldPassword: string, newPassword: string): Promise<void> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, password: true },
    });

    if (!user) {
      throw new NotFoundException("User not found");
    }

    // Social login users may not have a password
    if (!user.password) {
      throw new BadRequestException("Cannot change password for social login accounts");
    }

    // Verify old password
    const isOldPasswordValid = await bcrypt.compare(oldPassword, user.password);
    if (!isOldPasswordValid) {
      throw new UnauthorizedException("Current password is incorrect");
    }

    // Hash and save new password
    const hashedPassword = await bcrypt.hash(newPassword, BCRYPT_SALT_ROUNDS);

    await this.prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });

    // Revoke all refresh tokens for security
    await this.prisma.refreshToken.updateMany({
      where: {
        userId,
        revokedAt: null,
      },
      data: { revokedAt: new Date() },
    });

    this.logger.log(`Password changed for user: ${user.email}`);
  }

  /**
   * Soft delete user account
   * Note: This implementation marks the account as deleted by clearing sensitive data
   * In a production app, you might want to add a 'deletedAt' field to the User model
   */
  async deleteAccount(userId: string): Promise<void> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true },
    });

    if (!user) {
      throw new NotFoundException("User not found");
    }

    // Use a transaction to ensure all operations complete together
    await this.prisma.$transaction(async (tx) => {
      // Revoke all refresh tokens
      await tx.refreshToken.updateMany({
        where: { userId },
        data: { revokedAt: new Date() },
      });

      // Soft delete: anonymize user data instead of hard delete
      // This preserves quiz statistics and historical data
      const anonymizedEmail = `deleted_${userId}@deleted.local`;
      const anonymizedUsername = `deleted_${userId}`;

      await tx.user.update({
        where: { id: userId },
        data: {
          email: anonymizedEmail,
          username: anonymizedUsername,
          displayName: "Deleted User",
          avatarUrl: null,
          password: null,
          googleId: null,
          facebookId: null,
          appleId: null,
          isEmailVerified: false,
        },
      });
    });

    this.logger.log(`Account deleted (soft) for user: ${user.email}`);
  }
}
