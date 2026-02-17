# Module 03: Mobile Core Setup

## Tong quan

Module nay thiet lap nen tang cho ung dung mobile QuizApp su dung Expo SDK 52+ voi TypeScript. Bao gom cau hinh Expo Router, Gluestack UI, Zustand, TanStack Query va MMKV.

## Cau truc thu muc

```
apps/mobile/
├── app/                          # Expo Router pages
│   ├── (auth)/                   # Man hinh xac thuc
│   │   ├── _layout.tsx          # Layout cho auth screens
│   │   ├── login.tsx            # Man hinh dang nhap
│   │   ├── register.tsx         # Man hinh dang ky
│   │   └── forgot-password.tsx  # Man hinh quen mat khau
│   ├── (main)/                   # Man hinh chinh (can xac thuc)
│   │   ├── (tabs)/              # Tab navigation
│   │   │   ├── _layout.tsx      # Tab layout
│   │   │   ├── index.tsx        # Trang chu
│   │   │   ├── leaderboard.tsx  # Bang xep hang
│   │   │   └── profile.tsx      # Ho so ca nhan
│   │   └── _layout.tsx          # Layout chinh
│   ├── _layout.tsx              # Root layout
│   └── index.tsx                # Entry redirect
├── src/
│   ├── components/              # Components tai su dung
│   │   └── ui/                  # UI components co ban
│   │       ├── LoadingScreen.tsx
│   │       ├── ErrorView.tsx
│   │       └── EmptyState.tsx
│   ├── hooks/                   # Custom hooks
│   │   ├── useNetworkStatus.ts
│   │   └── useDebounce.ts
│   ├── services/                # API services
│   │   ├── api-client.ts        # Axios instance
│   │   ├── query-client.ts      # TanStack Query config
│   │   ├── auth.service.ts      # Auth API hooks
│   │   └── quiz.service.ts      # Quiz API hooks
│   ├── stores/                  # Zustand stores
│   │   ├── auth.store.ts        # Auth state management
│   │   ├── app.store.ts         # App state management
│   │   └── quiz.store.ts        # Quiz state management
│   ├── theme/                   # Gluestack theme
│   │   ├── gluestack.config.ts  # Theme configuration
│   │   └── index.ts             # Theme exports
│   └── utils/                   # Utilities
│       └── storage.ts           # MMKV storage
├── assets/                      # Hinh anh, fonts
├── app.json                     # Expo config
├── eas.json                     # EAS Build config
├── babel.config.js              # Babel config
├── metro.config.js              # Metro bundler config
├── tsconfig.json                # TypeScript config
└── package.json                 # Dependencies
```

## Cong nghe su dung

| Cong nghe | Version | Muc dich |
|-----------|---------|----------|
| Expo SDK | 52+ | Framework phat trien |
| Expo Router | 4.x | File-based navigation |
| Gluestack UI | 1.x | UI component library |
| Zustand | 5.x | State management |
| TanStack Query | 5.x | Server state management |
| MMKV | 3.x | Fast local storage |
| Axios | 1.x | HTTP client |
| TypeScript | 5.x | Type safety |

## Cau hinh chi tiet

### 1. Package.json

```json
{
  "name": "mobile",
  "version": "1.0.0",
  "main": "expo-router/entry",
  "dependencies": {
    "@quizapp/shared": "workspace:*",
    "@gluestack-ui/themed": "^1.1.68",
    "@tanstack/react-query": "^5.67.2",
    "expo": "~52.0.20",
    "expo-router": "~4.0.15",
    "react-native-mmkv": "^3.2.0",
    "zustand": "^5.0.3"
    // ... other deps
  }
}
```

### 2. TypeScript Paths

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "@/app/*": ["./app/*"],
      "@/components/*": ["./src/components/*"],
      "@/hooks/*": ["./src/hooks/*"],
      "@/services/*": ["./src/services/*"],
      "@/stores/*": ["./src/stores/*"],
      "@/theme/*": ["./src/theme/*"],
      "@/utils/*": ["./src/utils/*"]
    }
  }
}
```

### 3. Theme Colors

```typescript
const colors = {
  primary: "#6366F1",   // Indigo - mau chinh
  secondary: "#8B5CF6", // Purple - mau phu
  success: "#22C55E",   // Green - thanh cong
  error: "#EF4444",     // Red - loi
  warning: "#F59E0B",   // Amber - canh bao
  background: {
    light: "#FFFFFF",
    dark: "#0F172A"
  }
};
```

## Huong dan su dung

### 1. Zustand Store

**Auth Store:**
```typescript
import { useAuthStore } from "@/stores/auth.store";

function MyComponent() {
  const { user, isAuthenticated, login, logout } = useAuthStore();

  const handleLogin = async () => {
    try {
      await login(email, password);
    } catch (error) {
      // Handle error
    }
  };
}
```

**App Store:**
```typescript
import { useAppStore } from "@/stores/app.store";

function MyComponent() {
  const { isDarkMode, toggleDarkMode, preferences } = useAppStore();
}
```

### 2. TanStack Query

**Su dung Query:**
```typescript
import { useCategories, useStartQuiz } from "@/services/quiz.service";

function QuizScreen() {
  // Fetch data
  const { data: categories, isLoading, error } = useCategories();

  // Mutation
  const startQuiz = useStartQuiz();

  const handleStart = () => {
    startQuiz.mutate({
      categoryId: "1",
      difficulty: "medium",
      questionCount: 10
    });
  };
}
```

**Query Keys:**
```typescript
import { queryKeys } from "@/services/query-client";

// Invalidate queries
queryClient.invalidateQueries({ queryKey: queryKeys.quiz.categories() });

// Prefetch
queryClient.prefetchQuery({
  queryKey: queryKeys.quiz.questions("categoryId"),
  queryFn: () => fetchQuestions("categoryId")
});
```

### 3. MMKV Storage

```typescript
import { storage, storageHelper, STORAGE_KEYS } from "@/utils/storage";

// Luu tru string
storage.set("key", "value");
const value = storage.getString("key");

// Luu tru object
storageHelper.setObject("user", { name: "John" });
const user = storageHelper.getObject<User>("user");

// Su dung storage keys
storage.set(STORAGE_KEYS.ACCESS_TOKEN, token);
```

### 4. Navigation (Expo Router)

```typescript
import { router, Link } from "expo-router";

// Programmatic navigation
router.push("/(main)/(tabs)");
router.replace("/(auth)/login");
router.back();

// Link component
<Link href="/(auth)/register">Dang ky</Link>
```

### 5. Gluestack UI Components

```typescript
import {
  Box,
  Button,
  ButtonText,
  Heading,
  Text,
  VStack,
  HStack,
} from "@gluestack-ui/themed";

function MyScreen() {
  return (
    <Box flex={1} bg="$white" px="$4">
      <VStack space="md">
        <Heading size="xl" color="$primary600">
          Tieu de
        </Heading>
        <Text color="$textLight500">
          Noi dung
        </Text>
        <Button bgColor="$primary600" onPress={handlePress}>
          <ButtonText>Nhan vao day</ButtonText>
        </Button>
      </VStack>
    </Box>
  );
}
```

## API Client

### Cau hinh Axios

```typescript
// src/services/api-client.ts
const apiClient = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json"
  }
});

// Interceptors
apiClient.interceptors.request.use((config) => {
  const token = storage.getString("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auto refresh token
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Refresh token logic
    }
    return Promise.reject(error);
  }
);
```

## Authentication Flow

```
1. App khoi dong
   └── _layout.tsx: initialize() -> load tokens tu MMKV

2. Kiem tra auth state
   └── index.tsx: Redirect dua tren isAuthenticated

3. Dang nhap
   └── login.tsx -> authStore.login() -> Save tokens -> Navigate to (main)

4. Token refresh
   └── api-client.ts interceptor -> Auto refresh khi 401

5. Dang xuat
   └── profile.tsx -> authStore.logout() -> Clear storage -> Navigate to (auth)
```

## Screen Flow

```
app/
├── index.tsx ─────────────────────────────┐
│   (Entry point - redirect based on auth) │
│                                          │
├── (auth)/ ◄──────────────────────────────┤
│   ├── login.tsx                          │
│   ├── register.tsx                       │
│   └── forgot-password.tsx                │
│                                          │
└── (main)/ ◄──────────────────────────────┘
    └── (tabs)/
        ├── index.tsx (Home)
        ├── leaderboard.tsx
        └── profile.tsx
```

## Environment Variables

```bash
# .env
EXPO_PUBLIC_API_URL=http://localhost:3000/api/v1
EXPO_PUBLIC_EAS_PROJECT_ID=your-project-id
```

## Build Commands

```bash
# Development
pnpm dev              # Start Expo dev server
pnpm android          # Run on Android
pnpm ios              # Run on iOS

# Production builds
pnpm build:android    # EAS build for Android
pnpm build:ios        # EAS build for iOS

# Type checking
pnpm typecheck        # Run TypeScript check
pnpm lint             # Run ESLint
```

## EAS Build Profiles

| Profile | Muc dich | Output |
|---------|----------|--------|
| development | Dev client | APK (debug) |
| preview | Internal testing | APK |
| production | Store release | AAB/IPA |

## Luu y quan trong

### 1. Monorepo Workspace

Mobile app su dung shared package:
```typescript
import { User, LoginRequest } from "@quizapp/shared";
import { API_ENDPOINTS } from "@quizapp/shared";
```

### 2. Metro Config

Metro duoc cau hinh de ho tro monorepo:
```javascript
// metro.config.js
config.watchFolders = [monorepoRoot];
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, "node_modules"),
  path.resolve(monorepoRoot, "node_modules"),
];
```

### 3. Type Safety

- Su dung types tu `@quizapp/shared`
- Toan bo stores va services duoc typed
- Query keys duoc typed cho autocomplete

### 4. Error Handling

```typescript
import { getApiErrorMessage, isNetworkError } from "@/services/api-client";

try {
  await someApiCall();
} catch (error) {
  if (isNetworkError(error)) {
    // Show offline message
  } else {
    const message = getApiErrorMessage(error);
    // Show error message
  }
}
```

## Next Steps

1. **Offline Support**: Tich hop offline mode voi MMKV
2. **Push Notifications**: Setup Expo Notifications
3. **Deep Linking**: Cau hinh URL schemes
4. **Analytics**: Tich hop Firebase Analytics
5. **Error Tracking**: Setup Sentry
6. **Performance**: React Native Performance monitoring

## Tham khao

- [Expo Documentation](https://docs.expo.dev/)
- [Expo Router](https://docs.expo.dev/router/introduction/)
- [Gluestack UI](https://gluestack.io/)
- [Zustand](https://zustand-demo.pmnd.rs/)
- [TanStack Query](https://tanstack.com/query/latest)
- [MMKV](https://github.com/mrousavy/react-native-mmkv)
