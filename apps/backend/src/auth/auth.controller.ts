import { Controller, Post, Body, HttpCode, HttpStatus, UseGuards } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from "@nestjs/swagger";

import { AuthService } from "./auth.service";
import { RegisterDto, LoginDto, RefreshTokenDto, TokenResponseDto, LogoutResponseDto } from "./dto";
import { Public, CurrentUser } from "../common/decorators";
import { RefreshTokenGuard } from "../common/guards";
import { RefreshTokenPayload } from "./strategies/jwt-refresh.strategy";

@ApiTags("Authentication")
@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("register")
  @Public()
  @ApiOperation({
    summary: "Register a new user",
    description: "Create a new user account with email and password",
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: "User registered successfully",
    type: TokenResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: "Email or username already exists",
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: "Validation error",
  })
  async register(@Body() registerDto: RegisterDto): Promise<TokenResponseDto> {
    return this.authService.register(registerDto);
  }

  @Post("login")
  @Public()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: "Login user",
    description: "Authenticate user with email and password",
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "User logged in successfully",
    type: TokenResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: "Invalid credentials",
  })
  async login(@Body() loginDto: LoginDto): Promise<TokenResponseDto> {
    return this.authService.login(loginDto);
  }

  @Post("logout")
  @Public()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: "Logout user",
    description: "Invalidate the refresh token",
  })
  @ApiBody({ type: RefreshTokenDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "User logged out successfully",
    type: LogoutResponseDto,
  })
  async logout(@Body() refreshTokenDto: RefreshTokenDto): Promise<LogoutResponseDto> {
    await this.authService.logout(refreshTokenDto.refreshToken);
    return { message: "Logged out successfully" };
  }

  @Post("refresh")
  @Public()
  @UseGuards(RefreshTokenGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: "Refresh access token",
    description: "Get new access and refresh tokens using a valid refresh token",
  })
  @ApiBody({ type: RefreshTokenDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Tokens refreshed successfully",
    type: TokenResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: "Invalid or expired refresh token",
  })
  async refresh(@CurrentUser() user: RefreshTokenPayload): Promise<TokenResponseDto> {
    return this.authService.refreshTokens(user.id, user.refreshToken);
  }
}
