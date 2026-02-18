// src/types/admin.ts
var Role = /* @__PURE__ */ ((Role2) => {
  Role2["USER"] = "USER";
  Role2["ADMIN"] = "ADMIN";
  return Role2;
})(Role || {});

// src/constants/index.ts
var API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    REFRESH: "/auth/refresh",
    LOGOUT: "/auth/logout",
    FORGOT_PASSWORD: "/auth/forgot-password",
    RESET_PASSWORD: "/auth/reset-password",
    SOCIAL_LOGIN: "/auth/social",
    VERIFY_EMAIL: "/auth/verify-email"
  },
  USER: {
    PROFILE: "/users/me",
    UPDATE_PROFILE: "/users/me",
    PREFERENCES: "/users/me/preferences",
    STATS: "/users/me/stats",
    DELETE_ACCOUNT: "/users/me"
  },
  QUIZ: {
    CATEGORIES: "/categories",
    CATEGORY: "/categories/:id",
    QUESTIONS: "/questions",
    // Quiz Sessions
    START: "/quiz/start",
    SUBMIT_ANSWER: "/quiz/answer",
    SESSION: "/quiz/session/:id",
    COMPLETE_SESSION: "/quiz/session/:id/complete",
    ABANDON_SESSION: "/quiz/session/:id/abandon",
    HISTORY: "/quiz/history"
  },
  LEADERBOARD: {
    GLOBAL: "/leaderboards",
    CATEGORY: "/leaderboards/category/:id",
    USER_RANK: "/leaderboards/me",
    USER_CATEGORY_RANK: "/leaderboards/me/category/:id"
  },
  ACHIEVEMENTS: {
    LIST: "/achievements",
    USER_ACHIEVEMENTS: "/achievements/me",
    PROGRESS: "/achievements/me/progress"
  },
  DAILY_CHALLENGE: {
    TODAY: "/daily-challenge",
    STATUS: "/daily-challenge/status",
    START: "/daily-challenge/start",
    COMPLETE: "/daily-challenge/complete",
    STREAK: "/daily-challenge/streak"
  },
  NOTIFICATIONS: {
    LIST: "/notifications",
    MARK_READ: "/notifications/:id/read",
    PREFERENCES: "/notifications/preferences",
    REGISTER_DEVICE: "/notifications/device"
  },
  ADMIN: {
    DASHBOARD: "/admin/dashboard",
    CATEGORIES: "/categories",
    CATEGORY: "/categories/:id",
    QUESTIONS: "/questions",
    QUESTION: "/questions/:id",
    USERS: "/users",
    USER: "/users/:id"
  }
};
var ERROR_CODES = {
  // Auth errors
  INVALID_CREDENTIALS: "AUTH_001",
  EMAIL_NOT_VERIFIED: "AUTH_002",
  TOKEN_EXPIRED: "AUTH_003",
  TOKEN_INVALID: "AUTH_004",
  EMAIL_ALREADY_EXISTS: "AUTH_005",
  USERNAME_ALREADY_EXISTS: "AUTH_006",
  SOCIAL_AUTH_FAILED: "AUTH_007",
  // User errors
  USER_NOT_FOUND: "USER_001",
  INVALID_PASSWORD: "USER_002",
  // Quiz errors
  CATEGORY_NOT_FOUND: "QUIZ_001",
  SESSION_NOT_FOUND: "QUIZ_002",
  SESSION_ALREADY_COMPLETED: "QUIZ_003",
  INVALID_ANSWER: "QUIZ_004",
  // Multiplayer errors
  ROOM_NOT_FOUND: "ROOM_001",
  ROOM_FULL: "ROOM_002",
  ROOM_ALREADY_STARTED: "ROOM_003",
  NOT_ROOM_HOST: "ROOM_004",
  // General errors
  VALIDATION_ERROR: "GENERAL_001",
  NOT_FOUND: "GENERAL_002",
  UNAUTHORIZED: "GENERAL_003",
  FORBIDDEN: "GENERAL_004",
  INTERNAL_ERROR: "GENERAL_005"
};
var APP_CONSTANTS = {
  // Quiz
  DEFAULT_QUESTION_COUNT: 10,
  MAX_QUESTION_COUNT: 50,
  DEFAULT_TIME_LIMIT: 30,
  // seconds
  MIN_TIME_LIMIT: 10,
  MAX_TIME_LIMIT: 60,
  // Multiplayer
  DEFAULT_MAX_PLAYERS: 4,
  MAX_MAX_PLAYERS: 8,
  ROOM_CODE_LENGTH: 6,
  ROOM_COUNTDOWN_SECONDS: 3,
  // Pagination
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
  // Leaderboard
  LEADERBOARD_TOP_COUNT: 100,
  // Daily Challenge
  DAILY_CHALLENGE_QUESTION_COUNT: 10,
  STREAK_BONUS_MULTIPLIER: 0.1,
  // 10% bonus per streak day
  // Storage keys
  STORAGE_KEYS: {
    ACCESS_TOKEN: "accessToken",
    REFRESH_TOKEN: "refreshToken",
    USER: "user",
    PREFERENCES: "preferences",
    OFFLINE_QUIZZES: "offlineQuizzes",
    PENDING_SUBMISSIONS: "pendingSubmissions"
  }
};
var SUPPORTED_LANGUAGES = [
  { code: "en", name: "English" },
  { code: "vi", name: "Ti\u1EBFng Vi\u1EC7t" }
];
var ACHIEVEMENT_COLORS = {
  common: "#9CA3AF",
  rare: "#3B82F6",
  epic: "#8B5CF6",
  legendary: "#F59E0B"
};
var DIFFICULTY_COLORS = {
  easy: "#22C55E",
  medium: "#F59E0B",
  hard: "#EF4444"
};

export { ACHIEVEMENT_COLORS, API_ENDPOINTS, APP_CONSTANTS, DIFFICULTY_COLORS, ERROR_CODES, Role, SUPPORTED_LANGUAGES };
//# sourceMappingURL=index.mjs.map
//# sourceMappingURL=index.mjs.map