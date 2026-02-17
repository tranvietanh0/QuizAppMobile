import { Injectable, UnauthorizedException, ConflictException, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcryptjs";

import { PrismaService } from "../prisma/prisma.service";
import { RegisterDto, LoginDto, TokenResponseDto } from "./dto";
import { JwtPayload, AuthenticatedUser } from "./strategies/jwt.strategy";

const BCRYPT_SALT_ROUNDS = 12;
const ACCESS_TOKEN_EXPIRY_SECONDS = 15 * 60; // 15 minutes

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService
  ) {}

  /**
   * Register a new user with email and password
   */
  async register(registerDto: RegisterDto): Promise<TokenResponseDto> {
    const { email, username, password, displayName } = registerDto;

    // Check if email already exists
    const existingEmail = await this.prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existingEmail) {
      throw new ConflictException("Email is already registered");
    }

    // Check if username already exists
    const existingUsername = await this.prisma.user.findUnique({
      where: { username: username.toLowerCase() },
    });

    if (existingUsername) {
      throw new ConflictException("Username is already taken");
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, BCRYPT_SALT_ROUNDS);

    // Create user
    const user = await this.prisma.user.create({
      data: {
        email: email.toLowerCase(),
        username: username.toLowerCase(),
        displayName: displayName || username,
        password: hashedPassword,
      },
      select: {
        id: true,
        email: true,
        username: true,
        displayName: true,
        avatarUrl: true,
        isEmailVerified: true,
      },
    });

    this.logger.log(`New user registered: ${user.email}`);

    // Generate tokens
    return this.generateTokenResponse(user);
  }

  /**
   * Login user with email and password
   */
  async login(loginDto: LoginDto): Promise<TokenResponseDto> {
    const { email, password } = loginDto;

    const user = await this.validateUser(email, password);

    // Update last login time
    await this.prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    this.logger.log(`User logged in: ${user.email}`);

    return this.generateTokenResponse(user);
  }

  /**
   * Validate user credentials
   */
  async validateUser(email: string, password: string): Promise<AuthenticatedUser> {
    const user = await this.prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!user || !user.password) {
      throw new UnauthorizedException("Invalid email or password");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException("Invalid email or password");
    }

    return {
      id: user.id,
      email: user.email,
      username: user.username,
      displayName: user.displayName,
      avatarUrl: user.avatarUrl,
      isEmailVerified: user.isEmailVerified,
    };
  }

  /**
   * Logout user by revoking refresh token
   */
  async logout(refreshToken: string): Promise<void> {
    const token = await this.prisma.refreshToken.findUnique({
      where: { token: refreshToken },
    });

    if (token && !token.revokedAt) {
      await this.prisma.refreshToken.update({
        where: { id: token.id },
        data: { revokedAt: new Date() },
      });

      this.logger.log(`User logged out, refresh token revoked`);
    }
  }

  /**
   * Refresh tokens using a valid refresh token
   */
  async refreshTokens(userId: string, oldRefreshToken: string): Promise<TokenResponseDto> {
    // Get user data
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        username: true,
        displayName: true,
        avatarUrl: true,
        isEmailVerified: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException("User not found");
    }

    // Revoke old refresh token
    await this.prisma.refreshToken.update({
      where: { token: oldRefreshToken },
      data: { revokedAt: new Date() },
    });

    this.logger.log(`Tokens refreshed for user: ${user.email}`);

    // Generate new tokens
    return this.generateTokenResponse(user);
  }

  /**
   * Generate access and refresh tokens for a user
   */
  private async generateTokenResponse(user: AuthenticatedUser): Promise<TokenResponseDto> {
    const accessTokenPayload: JwtPayload = {
      sub: user.id,
      email: user.email,
      type: "access",
    };

    const refreshTokenPayload: JwtPayload = {
      sub: user.id,
      email: user.email,
      type: "refresh",
    };

    const accessToken = this.jwtService.sign(accessTokenPayload, {
      secret: this.configService.get<string>("app.jwt.secret"),
      expiresIn: this.configService.get<string>("app.jwt.accessExpiration"),
    });

    const refreshToken = this.jwtService.sign(refreshTokenPayload, {
      secret: this.configService.get<string>("app.jwt.refreshSecret"),
      expiresIn: this.configService.get<string>("app.jwt.refreshExpiration"),
    });

    // Store refresh token in database
    const refreshExpiration = this.parseExpiration(
      this.configService.get<string>("app.jwt.refreshExpiration") || "7d"
    );

    await this.prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: user.id,
        expiresAt: new Date(Date.now() + refreshExpiration),
      },
    });

    // Clean up expired refresh tokens for this user (async, don't wait)
    this.cleanupExpiredTokens(user.id).catch((err) => {
      this.logger.warn(`Failed to cleanup expired tokens: ${err.message}`);
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        displayName: user.displayName,
        avatarUrl: user.avatarUrl,
        isEmailVerified: user.isEmailVerified,
      },
      accessToken,
      refreshToken,
      expiresIn: ACCESS_TOKEN_EXPIRY_SECONDS,
    };
  }

  /**
   * Clean up expired or revoked refresh tokens for a user
   */
  private async cleanupExpiredTokens(userId: string): Promise<void> {
    await this.prisma.refreshToken.deleteMany({
      where: {
        userId,
        OR: [{ expiresAt: { lt: new Date() } }, { revokedAt: { not: null } }],
      },
    });
  }

  /**
   * Parse expiration string (e.g., "7d", "15m") to milliseconds
   */
  private parseExpiration(expiration: string): number {
    const match = expiration.match(/^(\d+)([smhd])$/);
    if (!match) {
      // Default to 7 days
      return 7 * 24 * 60 * 60 * 1000;
    }

    const value = parseInt(match[1], 10);
    const unit = match[2];

    switch (unit) {
      case "s":
        return value * 1000;
      case "m":
        return value * 60 * 1000;
      case "h":
        return value * 60 * 60 * 1000;
      case "d":
        return value * 24 * 60 * 60 * 1000;
      default:
        return 7 * 24 * 60 * 60 * 1000;
    }
  }
}
