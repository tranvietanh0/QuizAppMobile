import { create } from "zustand";
import type { DailyChallengeQuestion } from "@/services";

/**
 * Daily Challenge store state interface
 */
interface DailyChallengeState {
  // Attempt info
  attemptId: string | null;
  challengeId: string | null;

  // Quiz state
  currentQuestionIndex: number;
  selectedAnswer: string | null;
  timeRemaining: number;

  // Quiz data
  questions: DailyChallengeQuestion[];
  answers: Map<string, string>;

  // UI state
  isPaused: boolean;
  isCompleted: boolean;
}

/**
 * Daily Challenge store actions interface
 */
interface DailyChallengeActions {
  // Session management
  startChallenge: (
    attemptId: string,
    challengeId: string,
    questions: DailyChallengeQuestion[]
  ) => void;
  endChallenge: () => void;
  resetChallenge: () => void;

  // Question navigation
  nextQuestion: () => void;
  goToQuestion: (index: number) => void;

  // Answer handling
  selectAnswer: (answer: string) => void;
  submitAnswer: () => void;

  // Timer
  setTimeRemaining: (time: number) => void;
  decrementTime: () => void;
  pauseChallenge: () => void;
  resumeChallenge: () => void;

  // Getters
  getAnswers: () => { questionId: string; selectedAnswer: string }[];
}

type DailyChallengeStore = DailyChallengeState & DailyChallengeActions;

const initialState: DailyChallengeState = {
  attemptId: null,
  challengeId: null,
  currentQuestionIndex: 0,
  selectedAnswer: null,
  timeRemaining: 30,
  questions: [],
  answers: new Map(),
  isPaused: false,
  isCompleted: false,
};

/**
 * Daily Challenge store using Zustand
 * Manages daily challenge session state, questions, answers, and timing
 */
export const useDailyChallengeStore = create<DailyChallengeStore>((set, get) => ({
  ...initialState,

  /**
   * Start a new daily challenge
   */
  startChallenge: (attemptId: string, challengeId: string, questions: DailyChallengeQuestion[]) => {
    set({
      attemptId,
      challengeId,
      questions,
      currentQuestionIndex: 0,
      selectedAnswer: null,
      answers: new Map(),
      isPaused: false,
      isCompleted: false,
      timeRemaining: questions[0]?.timeLimit ?? 30,
    });
  },

  /**
   * End current challenge
   */
  endChallenge: () => {
    set({ isCompleted: true });
  },

  /**
   * Reset challenge state
   */
  resetChallenge: () => {
    set(initialState);
  },

  /**
   * Go to next question
   */
  nextQuestion: () => {
    const { currentQuestionIndex, questions, selectedAnswer, answers } = get();

    // Save current answer before moving
    const currentQuestion = questions[currentQuestionIndex];
    if (currentQuestion && selectedAnswer) {
      const newAnswers = new Map(answers);
      newAnswers.set(currentQuestion.id, selectedAnswer);
      set({ answers: newAnswers });
    }

    if (currentQuestionIndex < questions.length - 1) {
      const nextIndex = currentQuestionIndex + 1;
      const nextQuestion = questions[nextIndex];
      set({
        currentQuestionIndex: nextIndex,
        selectedAnswer: null,
        timeRemaining: nextQuestion?.timeLimit ?? 30,
      });
    } else {
      get().endChallenge();
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
        timeRemaining: question?.timeLimit ?? 30,
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
   * Submit current answer and save to map
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
    }
  },

  /**
   * Pause challenge
   */
  pauseChallenge: () => {
    set({ isPaused: true });
  },

  /**
   * Resume challenge
   */
  resumeChallenge: () => {
    set({ isPaused: false });
  },

  /**
   * Get all answers in API format
   */
  getAnswers: () => {
    const { answers } = get();
    return Array.from(answers.entries()).map(([questionId, selectedAnswer]) => ({
      questionId,
      selectedAnswer,
    }));
  },
}));
