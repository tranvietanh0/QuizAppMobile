// Multiplayer-related type definitions
// Các types liên quan đến chế độ chơi Multiplayer

export type RoomStatus = "waiting" | "in_progress" | "completed";
export type PlayerStatus = "ready" | "not_ready" | "playing" | "finished" | "disconnected";

export interface Player {
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

export interface Room {
  id: string;
  code: string; // Mã phòng 6 ký tự
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

export interface CreateRoomRequest {
  categoryId: string;
  maxPlayers?: number;
  questionCount?: number;
  difficulty?: "easy" | "medium" | "hard" | "mixed";
}

export interface CreateRoomResponse {
  room: Room;
}

export interface JoinRoomRequest {
  roomCode: string;
}

export interface JoinRoomResponse {
  room: Room;
}

// Socket Events - Client to Server
export interface ClientToServerEvents {
  "room:create": (data: CreateRoomRequest) => void;
  "room:join": (data: JoinRoomRequest) => void;
  "room:leave": () => void;
  "room:ready": () => void;
  "room:start": () => void;
  "game:answer": (data: { questionId: string; answer: string; timeSpent: number }) => void;
}

// Socket Events - Server to Client
export interface ServerToClientEvents {
  "room:created": (room: Room) => void;
  "room:joined": (room: Room) => void;
  "room:playerJoined": (player: Player) => void;
  "room:playerLeft": (playerId: string) => void;
  "room:playerReady": (playerId: string) => void;
  "room:starting": (countdown: number) => void;
  "room:error": (error: { code: string; message: string }) => void;

  "game:started": (data: { questionCount: number }) => void;
  "game:question": (data: {
    questionIndex: number;
    question: {
      id: string;
      content: string;
      options: string[];
      timeLimit: number;
    };
  }) => void;
  "game:playerAnswered": (data: { playerId: string; questionIndex: number }) => void;
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
