import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { FastifyRequest } from "fastify";

import { PrismaService } from "../../prisma/prisma.service";
import { JwtPayload, AuthenticatedUser } from "./jwt.strategy";

export interface RefreshTokenPayload extends AuthenticatedUser {
  refreshToken: string;
}

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, "jwt-refresh") {
  constructor(
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromBodyField("refreshToken"),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>("app.jwt.refreshSecret"),
      passReqToCallback: true,
    });
  }

  async validate(req: FastifyRequest, payload: JwtPayload): Promise<RefreshTokenPayload> {
    // Ensure this is a refresh token
    if (payload.type !== "refresh") {
      throw new UnauthorizedException("Invalid token type");
    }

    const refreshToken = (req.body as { refreshToken?: string })?.refreshToken;

    if (!refreshToken) {
      throw new UnauthorizedException("Refresh token is required");
    }

    // Check if the refresh token exists and is valid
    const storedToken = await this.prisma.refreshToken.findUnique({
      where: { token: refreshToken },
      include: { user: true },
    });

    if (!storedToken) {
      throw new UnauthorizedException("Invalid refresh token");
    }

    if (storedToken.revokedAt) {
      throw new UnauthorizedException("Refresh token has been revoked");
    }

    if (new Date() > storedToken.expiresAt) {
      throw new UnauthorizedException("Refresh token has expired");
    }

    if (storedToken.userId !== payload.sub) {
      throw new UnauthorizedException("Token does not match user");
    }

    const user = storedToken.user;

    return {
      id: user.id,
      email: user.email,
      username: user.username,
      displayName: user.displayName,
      avatarUrl: user.avatarUrl,
      isEmailVerified: user.isEmailVerified,
      refreshToken,
    };
  }
}
