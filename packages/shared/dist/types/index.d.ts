interface PaginationParams {
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
}
interface PaginatedResponse<T> {
    data: T[];
    meta: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
        hasNextPage: boolean;
        hasPrevPage: boolean;
    };
}
interface ApiResponse<T = unknown> {
    success: boolean;
    data?: T;
    message?: string;
    error?: ApiError;
}
interface ApiError {
    code: string;
    message: string;
    details?: Record<string, unknown>;
}
interface Timestamps {
    createdAt: Date;
    updatedAt: Date;
}
interface WithId {
    id: string;
}
interface SoftDelete {
    deletedAt: Date | null;
}

interface CategoryStat {
    categoryId: string;
    name: string;
    count: number;
}
interface UserGrowth {
    date: string;
    count: number;
}
interface RecentActivity {
    id: string;
    type: "user_registered" | "quiz_completed" | "question_added" | "category_added";
    description: string;
    timestamp: string;
}
interface DashboardStats {
    totalUsers: number;
    totalCategories: number;
    totalQuestions: number;
    totalQuizSessions: number;
    sessionsToday: number;
    questionsByCategory: CategoryStat[];
    userGrowth: UserGrowth[];
    recentActivity: RecentActivity[];
}
declare enum Role {
    USER = "USER",
    ADMIN = "ADMIN"
}

interface User {
    id: string;
    email: string;
    username: string;
    displayName: string | null;
    avatarUrl: string | null;
    isEmailVerified: boolean;
    role: Role;
    createdAt: Date;
    updatedAt: Date;
}
interface UserProfile extends User {
    totalQuizzes: number;
    totalCorrect: number;
    totalQuestions: number;
    averageScore: number;
    streakDays: number;
    bestStreak: number;
    rank: number | null;
}
interface UserPreferences {
    language: string;
    soundEnabled: boolean;
    vibrationEnabled: boolean;
    notificationsEnabled: boolean;
    darkMode: boolean;
    /** Theme preference: 'light', 'dark', or 'system' */
    themePreference?: "light" | "dark" | "system";
}
interface UserStats {
    totalQuizzes: number;
    totalCorrect: number;
    totalQuestions: number;
    averageScore: number;
    averageTimePerQuestion: number;
    categoryStats: CategoryStats[];
}
interface CategoryStats {
    categoryId: string;
    categoryName: string;
    totalQuizzes: number;
    totalCorrect: number;
    totalQuestions: number;
    averageScore: number;
}

interface LoginRequest {
    email: string;
    password: string;
}
interface RegisterRequest {
    email: string;
    username: string;
    password: string;
    displayName?: string;
}
interface AuthResponse {
    user: {
        id: string;
        email: string;
        username: string;
        displayName: string | null;
        avatarUrl: string | null;
        isEmailVerified: boolean;
    };
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
}
interface RefreshTokenRequest {
    refreshToken: string;
}
interface ForgotPasswordRequest {
    email: string;
}
interface ResetPasswordRequest {
    token: string;
    newPassword: string;
}
interface ChangePasswordRequest {
    currentPassword: string;
    newPassword: string;
}
type SocialProvider = "google" | "facebook" | "apple";
interface SocialLoginRequest {
    provider: SocialProvider;
    accessToken: string;
    idToken?: string;
}

interface Category {
    id: string;
    name: string;
    description: string | null;
    iconUrl: string | null;
    color: string;
    questionCount: number;
    isActive: boolean;
}
type QuestionType = "multiple_choice" | "true_false" | "fill_blank";
type Difficulty = "easy" | "medium" | "hard";
interface Question {
    id: string;
    categoryId: string;
    type: QuestionType;
    difficulty: Difficulty;
    content: string;
    options: string[];
    correctAnswer: string;
    explanation: string | null;
    imageUrl: string | null;
    timeLimit: number;
    points: number;
}
interface QuestionForClient extends Omit<Question, "correctAnswer" | "explanation"> {
}
interface QuizSession {
    id: string;
    userId: string;
    categoryId: string;
    questions: QuestionForClient[];
    totalQuestions: number;
    currentQuestionIndex: number;
    score: number;
    correctAnswers: number;
    startedAt: Date;
    completedAt: Date | null;
    timeSpent: number;
    status: QuizSessionStatus;
}
type QuizSessionStatus = "in_progress" | "completed" | "abandoned";
interface SubmitAnswerRequest {
    sessionId: string;
    questionId: string;
    answer: string;
    timeSpent: number;
}
interface SubmitAnswerResponse {
    isCorrect: boolean;
    correctAnswer: string;
    explanation: string | null;
    pointsEarned: number;
    currentScore: number;
    correctAnswers: number;
}
interface QuizResult {
    sessionId: string;
    userId: string;
    categoryId: string;
    categoryName: string;
    totalQuestions: number;
    correctAnswers: number;
    score: number;
    accuracy: number;
    timeSpent: number;
    averageTimePerQuestion: number;
    answers: QuizAnswer[];
    completedAt: Date;
}
interface QuizAnswer {
    questionId: string;
    question: string;
    userAnswer: string;
    correctAnswer: string;
    isCorrect: boolean;
    pointsEarned: number;
    timeSpent: number;
    explanation: string | null;
}
interface StartQuizRequest {
    categoryId: string;
    difficulty?: Difficulty;
    questionCount?: number;
}
interface StartQuizResponse {
    session: QuizSession;
}
interface QuizSessionRequest {
    categoryId: string;
    difficulty?: "EASY" | "MEDIUM" | "HARD";
    questionCount?: number;
}
interface QuizSessionResponse {
    sessionId: string;
    categoryId: string;
    categoryName: string;
    totalQuestions: number;
    currentIndex: number;
    questions: QuestionForPlay[];
}
interface QuestionForPlay {
    id: string;
    content: string;
    type: "MULTIPLE_CHOICE" | "TRUE_FALSE" | "FILL_BLANK";
    options: string[];
    timeLimit: number;
    points: number;
}
interface AnswerRequest {
    sessionId: string;
    questionId: string;
    selectedAnswer: string;
    timeSpent: number;
}
interface AnswerResponse {
    isCorrect: boolean;
    correctAnswer: string;
    explanation: string;
    pointsEarned: number;
    currentScore: number;
}
interface QuizResultResponse {
    sessionId: string;
    score: number;
    totalQuestions: number;
    correctAnswers: number;
    accuracy: number;
    timeSpent: number;
    answers: AnswerReview[];
}
interface AnswerReview {
    questionId: string;
    question: string;
    selectedAnswer: string;
    correctAnswer: string;
    isCorrect: boolean;
    explanation: string;
}

type LeaderboardPeriod = "daily" | "weekly" | "monthly" | "all_time";
type LeaderboardType = "global" | "category";
interface LeaderboardEntry {
    rank: number;
    userId: string;
    username: string;
    displayName: string | null;
    avatarUrl: string | null;
    score: number;
    totalQuizzes: number;
    accuracy: number;
    isCurrentUser: boolean;
}
interface LeaderboardResponse {
    type: LeaderboardType;
    period: LeaderboardPeriod;
    categoryId: string | null;
    categoryName: string | null;
    entries: LeaderboardEntry[];
    currentUserRank: LeaderboardEntry | null;
    totalParticipants: number;
    updatedAt: Date;
}
interface GetLeaderboardRequest {
    type: LeaderboardType;
    period: LeaderboardPeriod;
    categoryId?: string;
    limit?: number;
    offset?: number;
}
interface LeaderboardEntryNew {
    rank: number;
    userId: string;
    username: string;
    displayName: string;
    avatarUrl: string | null;
    score: number;
    gamesPlayed: number;
    accuracy: number;
}
interface LeaderboardResponseNew {
    entries: LeaderboardEntryNew[];
    userRank?: LeaderboardEntryNew;
    total: number;
    period: "daily" | "weekly" | "monthly" | "all_time";
}
interface LeaderboardFilter {
    categoryId?: string;
    period?: "daily" | "weekly" | "monthly" | "all_time";
    limit?: number;
    offset?: number;
}

type RoomStatus = "waiting" | "in_progress" | "completed";
type PlayerStatus = "ready" | "not_ready" | "playing" | "finished" | "disconnected";
interface Player {
    id: string;
    odId: string;
    username: string;
    displayName: string | null;
    avatarUrl: string | null;
    status: PlayerStatus;
    score: number;
    correctAnswers: number;
    currentQuestionIndex: number;
    isHost: boolean;
}
interface Room {
    id: string;
    code: string;
    hostId: string;
    categoryId: string;
    categoryName: string;
    status: RoomStatus;
    players: Player[];
    maxPlayers: number;
    questionCount: number;
    difficulty: "easy" | "medium" | "hard" | "mixed";
    createdAt: Date;
    startedAt: Date | null;
    completedAt: Date | null;
}
interface CreateRoomRequest {
    categoryId: string;
    maxPlayers?: number;
    questionCount?: number;
    difficulty?: "easy" | "medium" | "hard" | "mixed";
}
interface CreateRoomResponse {
    room: Room;
}
interface JoinRoomRequest {
    roomCode: string;
}
interface JoinRoomResponse {
    room: Room;
}
interface ClientToServerEvents {
    "room:create": (data: CreateRoomRequest) => void;
    "room:join": (data: JoinRoomRequest) => void;
    "room:leave": () => void;
    "room:ready": () => void;
    "room:start": () => void;
    "game:answer": (data: {
        questionId: string;
        answer: string;
        timeSpent: number;
    }) => void;
}
interface ServerToClientEvents {
    "room:created": (room: Room) => void;
    "room:joined": (room: Room) => void;
    "room:playerJoined": (player: Player) => void;
    "room:playerLeft": (playerId: string) => void;
    "room:playerReady": (playerId: string) => void;
    "room:starting": (countdown: number) => void;
    "room:error": (error: {
        code: string;
        message: string;
    }) => void;
    "game:started": (data: {
        questionCount: number;
    }) => void;
    "game:question": (data: {
        questionIndex: number;
        question: {
            id: string;
            content: string;
            options: string[];
            timeLimit: number;
        };
    }) => void;
    "game:playerAnswered": (data: {
        playerId: string;
        questionIndex: number;
    }) => void;
    "game:questionResult": (data: {
        questionId: string;
        correctAnswer: string;
        playerResults: Array<{
            playerId: string;
            answer: string;
            isCorrect: boolean;
            pointsEarned: number;
            totalScore: number;
        }>;
    }) => void;
    "game:ended": (data: {
        rankings: Array<{
            playerId: string;
            rank: number;
            score: number;
            correctAnswers: number;
        }>;
    }) => void;
}

type AchievementCategory = "quiz_count" | "accuracy" | "streak" | "speed" | "multiplayer" | "category_master" | "special";
type AchievementRarity = "common" | "rare" | "epic" | "legendary";
interface Achievement {
    id: string;
    name: string;
    description: string;
    iconUrl: string;
    category: AchievementCategory;
    rarity: AchievementRarity;
    points: number;
    requirement: AchievementRequirement;
    isHidden: boolean;
}
interface AchievementRequirement {
    type: string;
    value: number;
    categoryId?: string;
}
interface UserAchievement {
    id: string;
    achievementId: string;
    achievement: Achievement;
    unlockedAt: Date;
    progress: number;
    isUnlocked: boolean;
}
interface AchievementProgress {
    achievementId: string;
    currentValue: number;
    targetValue: number;
    progress: number;
    isUnlocked: boolean;
}
interface AchievementUnlockedEvent {
    achievement: Achievement;
    unlockedAt: Date;
}

interface DailyChallenge {
    id: string;
    date: string;
    title: string;
    description: string;
    categoryId: string | null;
    categoryName: string | null;
    questionCount: number;
    difficulty: "easy" | "medium" | "hard" | "mixed";
    bonusPoints: number;
    expiresAt: Date;
    isCompleted: boolean;
}
interface DailyChallengeResult {
    challengeId: string;
    userId: string;
    score: number;
    correctAnswers: number;
    totalQuestions: number;
    timeSpent: number;
    bonusEarned: number;
    completedAt: Date;
    rank: number | null;
}
interface UserStreak {
    currentStreak: number;
    bestStreak: number;
    lastPlayedDate: string | null;
    totalDaysPlayed: number;
}
interface DailyChallengeLeaderboard {
    date: string;
    entries: Array<{
        rank: number;
        userId: string;
        username: string;
        displayName: string | null;
        avatarUrl: string | null;
        score: number;
        timeSpent: number;
        isCurrentUser: boolean;
    }>;
    totalParticipants: number;
}
interface DailyChallengeNew {
    id: string;
    date: string;
    categoryId: string;
    categoryName: string;
    questionCount: number;
    difficulty: "EASY" | "MEDIUM" | "HARD";
    rewardPoints: number;
    isCompleted: boolean;
    userScore?: number;
}
interface DailyChallengeResponse {
    challenge: DailyChallengeNew;
    streak: StreakInfo;
}
interface StreakInfo {
    currentStreak: number;
    longestStreak: number;
    lastCompletedDate: string | null;
}
interface DailyChallengeResultNew {
    challengeId: string;
    score: number;
    totalQuestions: number;
    correctAnswers: number;
    streakBonus: number;
    totalReward: number;
    newStreak: number;
}

type NotificationType = "daily_reminder" | "daily_challenge" | "achievement" | "streak_warning" | "leaderboard" | "multiplayer_invite" | "system";
interface Notification {
    id: string;
    userId: string;
    type: NotificationType;
    title: string;
    body: string;
    data: Record<string, unknown>;
    isRead: boolean;
    createdAt: Date;
}
interface PushNotificationPayload {
    title: string;
    body: string;
    data?: Record<string, unknown>;
}
interface DeviceToken {
    id: string;
    userId: string;
    token: string;
    platform: "ios" | "android";
    createdAt: Date;
    updatedAt: Date;
}
interface RegisterDeviceTokenRequest {
    token: string;
    platform: "ios" | "android";
}
interface NotificationPreferences {
    dailyReminder: boolean;
    dailyReminderTime: string;
    dailyChallenge: boolean;
    achievements: boolean;
    streakWarning: boolean;
    leaderboard: boolean;
    multiplayerInvite: boolean;
}

export { type Achievement, type AchievementCategory, type AchievementProgress, type AchievementRarity, type AchievementRequirement, type AchievementUnlockedEvent, type AnswerRequest, type AnswerResponse, type AnswerReview, type ApiError, type ApiResponse, type AuthResponse, type Category, type CategoryStat, type CategoryStats, type ChangePasswordRequest, type ClientToServerEvents, type CreateRoomRequest, type CreateRoomResponse, type DailyChallenge, type DailyChallengeLeaderboard, type DailyChallengeNew, type DailyChallengeResponse, type DailyChallengeResult, type DailyChallengeResultNew, type DashboardStats, type DeviceToken, type Difficulty, type ForgotPasswordRequest, type GetLeaderboardRequest, type JoinRoomRequest, type JoinRoomResponse, type LeaderboardEntry, type LeaderboardEntryNew, type LeaderboardFilter, type LeaderboardPeriod, type LeaderboardResponse, type LeaderboardResponseNew, type LeaderboardType, type LoginRequest, type Notification, type NotificationPreferences, type NotificationType, type PaginatedResponse, type PaginationParams, type Player, type PlayerStatus, type PushNotificationPayload, type Question, type QuestionForClient, type QuestionForPlay, type QuestionType, type QuizAnswer, type QuizResult, type QuizResultResponse, type QuizSession, type QuizSessionRequest, type QuizSessionResponse, type QuizSessionStatus, type RecentActivity, type RefreshTokenRequest, type RegisterDeviceTokenRequest, type RegisterRequest, type ResetPasswordRequest, Role, type Room, type RoomStatus, type ServerToClientEvents, type SocialLoginRequest, type SocialProvider, type SoftDelete, type StartQuizRequest, type StartQuizResponse, type StreakInfo, type SubmitAnswerRequest, type SubmitAnswerResponse, type Timestamps, type User, type UserAchievement, type UserGrowth, type UserPreferences, type UserProfile, type UserStats, type UserStreak, type WithId };
