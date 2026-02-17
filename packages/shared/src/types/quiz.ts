// Quiz-related type definitions
// Các types liên quan đến Quiz

export interface Category {
  id: string;
  name: string;
  description: string | null;
  iconUrl: string | null;
  color: string;
  questionCount: number;
  isActive: boolean;
}

export type QuestionType = "multiple_choice" | "true_false" | "fill_blank";
export type Difficulty = "easy" | "medium" | "hard";

export interface Question {
  id: string;
  categoryId: string;
  type: QuestionType;
  difficulty: Difficulty;
  content: string;
  options: string[]; // Các lựa chọn (cho multiple_choice)
  correctAnswer: string;
  explanation: string | null;
  imageUrl: string | null;
  timeLimit: number; // Thời gian trả lời (giây)
  points: number;
}

// Question được gửi đến client (không có đáp án đúng)
export interface QuestionForClient extends Omit<Question, "correctAnswer" | "explanation"> {}

export interface QuizSession {
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
  timeSpent: number; // Tổng thời gian (giây)
  status: QuizSessionStatus;
}

export type QuizSessionStatus = "in_progress" | "completed" | "abandoned";

export interface SubmitAnswerRequest {
  sessionId: string;
  questionId: string;
  answer: string;
  timeSpent: number; // Thời gian trả lời câu này (giây)
}

export interface SubmitAnswerResponse {
  isCorrect: boolean;
  correctAnswer: string;
  explanation: string | null;
  pointsEarned: number;
  currentScore: number;
  correctAnswers: number;
}

export interface QuizResult {
  sessionId: string;
  userId: string;
  categoryId: string;
  categoryName: string;
  totalQuestions: number;
  correctAnswers: number;
  score: number;
  accuracy: number; // Phần trăm đúng
  timeSpent: number;
  averageTimePerQuestion: number;
  answers: QuizAnswer[];
  completedAt: Date;
}

export interface QuizAnswer {
  questionId: string;
  question: string;
  userAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
  pointsEarned: number;
  timeSpent: number;
  explanation: string | null;
}

export interface StartQuizRequest {
  categoryId: string;
  difficulty?: Difficulty;
  questionCount?: number;
}

export interface StartQuizResponse {
  session: QuizSession;
}
