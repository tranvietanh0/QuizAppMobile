// Notification-related type definitions
// Các types liên quan đến Notifications

export type NotificationType =
  | "daily_reminder" // Nhắc nhở chơi hàng ngày
  | "daily_challenge" // Thử thách mới
  | "achievement" // Mở khóa thành tựu
  | "streak_warning" // Cảnh báo mất streak
  | "leaderboard" // Thay đổi rank
  | "multiplayer_invite" // Mời chơi multiplayer
  | "system"; // Thông báo hệ thống

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  body: string;
  data: Record<string, unknown>;
  isRead: boolean;
  createdAt: Date;
}

export interface PushNotificationPayload {
  title: string;
  body: string;
  data?: Record<string, unknown>;
}

export interface DeviceToken {
  id: string;
  userId: string;
  token: string;
  platform: "ios" | "android";
  createdAt: Date;
  updatedAt: Date;
}

export interface RegisterDeviceTokenRequest {
  token: string;
  platform: "ios" | "android";
}

export interface NotificationPreferences {
  dailyReminder: boolean;
  dailyReminderTime: string; // Format: HH:mm
  dailyChallenge: boolean;
  achievements: boolean;
  streakWarning: boolean;
  leaderboard: boolean;
  multiplayerInvite: boolean;
}
