// Achievement-related type definitions
// Các types liên quan đến Achievements (thành tựu)

export type AchievementCategory =
  | "quiz_count" // Số lượng quiz hoàn thành
  | "accuracy" // Độ chính xác
  | "streak" // Chuỗi ngày chơi
  | "speed" // Tốc độ trả lời
  | "multiplayer" // Chế độ multiplayer
  | "category_master" // Hoàn thành category
  | "special"; // Đặc biệt

export type AchievementRarity = "common" | "rare" | "epic" | "legendary";

export interface Achievement {
  id: string;
  name: string;
  description: string;
  iconUrl: string;
  category: AchievementCategory;
  rarity: AchievementRarity;
  points: number; // Điểm thành tựu
  requirement: AchievementRequirement;
  isHidden: boolean; // Achievement ẩn cho đến khi unlock
}

export interface AchievementRequirement {
  type: string;
  value: number;
  categoryId?: string; // Nếu liên quan đến category cụ thể
}

export interface UserAchievement {
  id: string;
  achievementId: string;
  achievement: Achievement;
  unlockedAt: Date;
  progress: number; // 0-100%
  isUnlocked: boolean;
}

export interface AchievementProgress {
  achievementId: string;
  currentValue: number;
  targetValue: number;
  progress: number; // 0-100%
  isUnlocked: boolean;
}

export interface AchievementUnlockedEvent {
  achievement: Achievement;
  unlockedAt: Date;
}
