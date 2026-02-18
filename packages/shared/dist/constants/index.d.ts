declare const API_ENDPOINTS: {
    readonly AUTH: {
        readonly LOGIN: "/auth/login";
        readonly REGISTER: "/auth/register";
        readonly REFRESH: "/auth/refresh";
        readonly LOGOUT: "/auth/logout";
        readonly FORGOT_PASSWORD: "/auth/forgot-password";
        readonly RESET_PASSWORD: "/auth/reset-password";
        readonly SOCIAL_LOGIN: "/auth/social";
        readonly VERIFY_EMAIL: "/auth/verify-email";
    };
    readonly USER: {
        readonly PROFILE: "/users/me";
        readonly UPDATE_PROFILE: "/users/me";
        readonly PREFERENCES: "/users/me/preferences";
        readonly STATS: "/users/me/stats";
        readonly DELETE_ACCOUNT: "/users/me";
    };
    readonly QUIZ: {
        readonly CATEGORIES: "/categories";
        readonly CATEGORY: "/categories/:id";
        readonly QUESTIONS: "/questions";
        readonly START: "/quiz/start";
        readonly SUBMIT_ANSWER: "/quiz/answer";
        readonly SESSION: "/quiz/session/:id";
        readonly COMPLETE_SESSION: "/quiz/session/:id/complete";
        readonly ABANDON_SESSION: "/quiz/session/:id/abandon";
        readonly HISTORY: "/quiz/history";
    };
    readonly LEADERBOARD: {
        readonly GLOBAL: "/leaderboards";
        readonly CATEGORY: "/leaderboards/category/:id";
        readonly USER_RANK: "/leaderboards/me";
        readonly USER_CATEGORY_RANK: "/leaderboards/me/category/:id";
    };
    readonly ACHIEVEMENTS: {
        readonly LIST: "/achievements";
        readonly USER_ACHIEVEMENTS: "/achievements/me";
        readonly PROGRESS: "/achievements/me/progress";
    };
    readonly DAILY_CHALLENGE: {
        readonly TODAY: "/daily-challenge";
        readonly STATUS: "/daily-challenge/status";
        readonly START: "/daily-challenge/start";
        readonly COMPLETE: "/daily-challenge/complete";
        readonly STREAK: "/daily-challenge/streak";
    };
    readonly NOTIFICATIONS: {
        readonly LIST: "/notifications";
        readonly MARK_READ: "/notifications/:id/read";
        readonly PREFERENCES: "/notifications/preferences";
        readonly REGISTER_DEVICE: "/notifications/device";
    };
    readonly ADMIN: {
        readonly DASHBOARD: "/admin/dashboard";
        readonly CATEGORIES: "/categories";
        readonly CATEGORY: "/categories/:id";
        readonly QUESTIONS: "/questions";
        readonly QUESTION: "/questions/:id";
        readonly USERS: "/users";
        readonly USER: "/users/:id";
    };
};
declare const ERROR_CODES: {
    readonly INVALID_CREDENTIALS: "AUTH_001";
    readonly EMAIL_NOT_VERIFIED: "AUTH_002";
    readonly TOKEN_EXPIRED: "AUTH_003";
    readonly TOKEN_INVALID: "AUTH_004";
    readonly EMAIL_ALREADY_EXISTS: "AUTH_005";
    readonly USERNAME_ALREADY_EXISTS: "AUTH_006";
    readonly SOCIAL_AUTH_FAILED: "AUTH_007";
    readonly USER_NOT_FOUND: "USER_001";
    readonly INVALID_PASSWORD: "USER_002";
    readonly CATEGORY_NOT_FOUND: "QUIZ_001";
    readonly SESSION_NOT_FOUND: "QUIZ_002";
    readonly SESSION_ALREADY_COMPLETED: "QUIZ_003";
    readonly INVALID_ANSWER: "QUIZ_004";
    readonly ROOM_NOT_FOUND: "ROOM_001";
    readonly ROOM_FULL: "ROOM_002";
    readonly ROOM_ALREADY_STARTED: "ROOM_003";
    readonly NOT_ROOM_HOST: "ROOM_004";
    readonly VALIDATION_ERROR: "GENERAL_001";
    readonly NOT_FOUND: "GENERAL_002";
    readonly UNAUTHORIZED: "GENERAL_003";
    readonly FORBIDDEN: "GENERAL_004";
    readonly INTERNAL_ERROR: "GENERAL_005";
};
declare const APP_CONSTANTS: {
    readonly DEFAULT_QUESTION_COUNT: 10;
    readonly MAX_QUESTION_COUNT: 50;
    readonly DEFAULT_TIME_LIMIT: 30;
    readonly MIN_TIME_LIMIT: 10;
    readonly MAX_TIME_LIMIT: 60;
    readonly DEFAULT_MAX_PLAYERS: 4;
    readonly MAX_MAX_PLAYERS: 8;
    readonly ROOM_CODE_LENGTH: 6;
    readonly ROOM_COUNTDOWN_SECONDS: 3;
    readonly DEFAULT_PAGE_SIZE: 20;
    readonly MAX_PAGE_SIZE: 100;
    readonly LEADERBOARD_TOP_COUNT: 100;
    readonly DAILY_CHALLENGE_QUESTION_COUNT: 10;
    readonly STREAK_BONUS_MULTIPLIER: 0.1;
    readonly STORAGE_KEYS: {
        readonly ACCESS_TOKEN: "accessToken";
        readonly REFRESH_TOKEN: "refreshToken";
        readonly USER: "user";
        readonly PREFERENCES: "preferences";
        readonly OFFLINE_QUIZZES: "offlineQuizzes";
        readonly PENDING_SUBMISSIONS: "pendingSubmissions";
    };
};
declare const SUPPORTED_LANGUAGES: readonly [{
    readonly code: "en";
    readonly name: "English";
}, {
    readonly code: "vi";
    readonly name: "Tiếng Việt";
}];
declare const ACHIEVEMENT_COLORS: {
    readonly common: "#9CA3AF";
    readonly rare: "#3B82F6";
    readonly epic: "#8B5CF6";
    readonly legendary: "#F59E0B";
};
declare const DIFFICULTY_COLORS: {
    readonly easy: "#22C55E";
    readonly medium: "#F59E0B";
    readonly hard: "#EF4444";
};

export { ACHIEVEMENT_COLORS, API_ENDPOINTS, APP_CONSTANTS, DIFFICULTY_COLORS, ERROR_CODES, SUPPORTED_LANGUAGES };
