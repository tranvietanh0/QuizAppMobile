import { create } from "zustand";
import type { Category, Difficulty } from "@quizapp/shared";

/**
 * Session question type (matches backend response)
 */
interface SessionQuestion {
  id: string;
  content: string;
  type: "MULTIPLE_CHOICE" | "TRUE_FALSE" | "FILL_BLANK";
  difficulty: "EASY" | "MEDIUM" | "HARD";
  options: string[];
  imageUrl: string | null;
  points: number;
  timeLimit: number;
}

/**
 * Quiz store state interface
 */
interface QuizState {
  // Current session ID
  currentSessionId: string | null;
  currentQuestionIndex: number;
  selectedAnswer: string | null;
  timeRemaining: number;

  // Quiz configuration
  selectedCategory: Category | null;
  selectedDifficulty: Difficulty | null;
  questionCount: number;

  // Quiz data
  questions: SessionQuestion[];
  answers: Map<string, string>;

  // UI state
  isLoading: boolean;
  isPaused: boolean;
  isCompleted: boolean;
}

/**
 * Quiz store actions interface
 */
interface QuizActions {
  // Session management
  startQuiz: (category: Category, difficulty: Difficulty, count: number) => void;
  endQuiz: () => void;
  resetQuiz: () => void;

  // Question navigation
  setQuestions: (questions: SessionQuestion[]) => void;
  nextQuestion: () => void;
  previousQuestion: () => void;
  goToQuestion: (index: number) => void;

  // Answer handling
  selectAnswer: (answer: string) => void;
  submitAnswer: () => void;
  clearAnswer: () => void;

  // Timer
  setTimeRemaining: (time: number) => void;
  decrementTime: () => void;
  pauseQuiz: () => void;
  resumeQuiz: () => void;

  // Configuration
  setSelectedCategory: (category: Category | null) => void;
  setSelectedDifficulty: (difficulty: Difficulty | null) => void;
  setQuestionCount: (count: number) => void;

  // Session
  setSessionId: (sessionId: string | null) => void;
  setLoading: (loading: boolean) => void;
}

type QuizStore = QuizState & QuizActions;

const initialState: QuizState = {
  currentSessionId: null,
  currentQuestionIndex: 0,
  selectedAnswer: null,
  timeRemaining: 30,
  selectedCategory: null,
  selectedDifficulty: null,
  questionCount: 10,
  questions: [],
  answers: new Map(),
  isLoading: false,
  isPaused: false,
  isCompleted: false,
};

/**
 * Quiz store using Zustand
 * Manages quiz session state, questions, answers, and timing
 */
export const useQuizStore = create<QuizStore>((set, get) => ({
  ...initialState,

  /**
   * Start a new quiz
   */
  startQuiz: (category: Category, difficulty: Difficulty, count: number) => {
    set({
      selectedCategory: category,
      selectedDifficulty: difficulty,
      questionCount: count,
      currentQuestionIndex: 0,
      selectedAnswer: null,
      answers: new Map(),
      isLoading: true,
      isPaused: false,
      isCompleted: false,
    });
  },

  /**
   * End current quiz
   */
  endQuiz: () => {
    set({ isCompleted: true });
  },

  /**
   * Reset quiz state
   */
  resetQuiz: () => {
    set(initialState);
  },

  /**
   * Set questions for current quiz
   */
  setQuestions: (questions: SessionQuestion[]) => {
    set({
      questions,
      isLoading: false,
      timeRemaining: 30, // Reset timer for first question
    });
  },

  /**
   * Go to next question
   */
  nextQuestion: () => {
    const { currentQuestionIndex, questions } = get();
    if (currentQuestionIndex < questions.length - 1) {
      set({
        currentQuestionIndex: currentQuestionIndex + 1,
        selectedAnswer: null,
        timeRemaining: 30,
      });
    } else {
      get().endQuiz();
    }
  },

  /**
   * Go to previous question
   */
  previousQuestion: () => {
    const { currentQuestionIndex, answers, questions } = get();
    if (currentQuestionIndex > 0) {
      const prevIndex = currentQuestionIndex - 1;
      const prevQuestion = questions[prevIndex];
      const prevAnswer = prevQuestion ? answers.get(prevQuestion.id) : null;
      set({
        currentQuestionIndex: prevIndex,
        selectedAnswer: prevAnswer || null,
      });
    }
  },

  /**
   * Go to specific question
   */
  goToQuestion: (index: number) => {
    const { questions, answers } = get();
    if (index >= 0 && index < questions.length) {
      const question = questions[index];
      const existingAnswer = question ? answers.get(question.id) : null;
      set({
        currentQuestionIndex: index,
        selectedAnswer: existingAnswer || null,
      });
    }
  },

  /**
   * Select an answer
   */
  selectAnswer: (answer: string) => {
    set({ selectedAnswer: answer });
  },

  /**
   * Submit current answer
   */
  submitAnswer: () => {
    const { currentQuestionIndex, selectedAnswer, questions, answers } = get();
    const currentQuestion = questions[currentQuestionIndex];

    if (currentQuestion && selectedAnswer) {
      const newAnswers = new Map(answers);
      newAnswers.set(currentQuestion.id, selectedAnswer);
      set({ answers: newAnswers });
    }
  },

  /**
   * Clear selected answer
   */
  clearAnswer: () => {
    set({ selectedAnswer: null });
  },

  /**
   * Set remaining time
   */
  setTimeRemaining: (time: number) => {
    set({ timeRemaining: time });
  },

  /**
   * Decrement time by 1 second
   */
  decrementTime: () => {
    const { timeRemaining } = get();
    if (timeRemaining > 0) {
      set({ timeRemaining: timeRemaining - 1 });
    } else {
      // Auto-submit and move to next question when time runs out
      get().submitAnswer();
      get().nextQuestion();
    }
  },

  /**
   * Pause quiz
   */
  pauseQuiz: () => {
    set({ isPaused: true });
  },

  /**
   * Resume quiz
   */
  resumeQuiz: () => {
    set({ isPaused: false });
  },

  /**
   * Set selected category
   */
  setSelectedCategory: (category: Category | null) => {
    set({ selectedCategory: category });
  },

  /**
   * Set selected difficulty
   */
  setSelectedDifficulty: (difficulty: Difficulty | null) => {
    set({ selectedDifficulty: difficulty });
  },

  /**
   * Set question count
   */
  setQuestionCount: (count: number) => {
    set({ questionCount: count });
  },

  /**
   * Set quiz session ID
   */
  setSessionId: (sessionId: string | null) => {
    set({ currentSessionId: sessionId });
  },

  /**
   * Set loading state
   */
  setLoading: (loading: boolean) => {
    set({ isLoading: loading });
  },
}));
