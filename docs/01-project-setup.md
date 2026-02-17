# Module 01: Project Setup & Monorepo

## Tổng quan

Module này thiết lập cấu trúc monorepo cho dự án QuizApp sử dụng pnpm workspaces và Turborepo. Monorepo cho phép quản lý tất cả các apps (mobile, backend, admin) và shared packages trong một repository duy nhất.

## Cấu trúc thư mục

```
QuizAppMobile/
├── apps/
│   ├── mobile/                 # React Native (Expo) app
│   ├── backend/                # NestJS API server
│   └── admin/                  # Next.js admin panel
├── packages/
│   └── shared/                 # Shared types, constants, utilities
├── docs/                       # Documentation (tiếng Việt)
├── .github/
│   └── workflows/              # CI/CD pipelines
├── .husky/                     # Git hooks
│   ├── pre-commit             # Chạy lint-staged trước commit
│   └── commit-msg             # Kiểm tra commit message format
├── package.json               # Root package.json
├── pnpm-workspace.yaml        # pnpm workspace config
├── turbo.json                 # Turborepo config
├── tsconfig.base.json         # Base TypeScript config
├── eslint.config.mjs          # ESLint config (flat config)
├── .prettierrc                # Prettier config
├── .prettierignore            # Prettier ignore patterns
├── .gitignore                 # Git ignore patterns
└── commitlint.config.js       # Commit message lint config
```

## Công nghệ sử dụng

| Tool        | Version | Mục đích                              |
| ----------- | ------- | ------------------------------------- |
| pnpm        | 10.x    | Package manager với workspace support |
| Turborepo   | 2.x     | Monorepo build orchestration          |
| TypeScript  | 5.x     | Type-safe JavaScript                  |
| ESLint      | 9.x     | Code linting (flat config)            |
| Prettier    | 3.x     | Code formatting                       |
| Husky       | 9.x     | Git hooks                             |
| lint-staged | 15.x    | Run linters on staged files           |
| commitlint  | 19.x    | Conventional commit enforcement       |

## Các file cấu hình chính

### pnpm-workspace.yaml

Định nghĩa các packages trong monorepo:

```yaml
packages:
  - "apps/*"
  - "packages/*"
```

### turbo.json

Cấu hình Turborepo cho build pipeline:

```json
{
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**", ".next/**", "build/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "lint": {
      "dependsOn": ["^build"]
    },
    "test": {
      "dependsOn": ["^build"]
    }
  }
}
```

**Giải thích:**

- `dependsOn: ["^build"]`: Task này phụ thuộc vào build của các dependencies
- `outputs`: Các thư mục được cache
- `cache: false`: Không cache (cho dev mode)
- `persistent: true`: Giữ process chạy (cho dev servers)

### tsconfig.base.json

Base TypeScript config được extend bởi tất cả packages:

```json
{
  "compilerOptions": {
    "strict": true,
    "module": "ESNext",
    "moduleResolution": "bundler",
    "target": "ES2022",
    "skipLibCheck": true,
    "declaration": true,
    "sourceMap": true
  }
}
```

### eslint.config.mjs

ESLint 9 flat config với TypeScript và Prettier support:

```javascript
import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import prettier from "eslint-config-prettier";

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  prettier,
  {
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
        },
      ],
      "no-console": ["warn", { allow: ["warn", "error"] }],
    },
  }
);
```

### Commit Message Format

Sử dụng Conventional Commits:

```
type(scope): message

Ví dụ:
feat(auth): add Google login support
fix(quiz): resolve score calculation bug
docs(readme): update installation guide
```

**Types cho phép:**

- `feat`: Tính năng mới
- `fix`: Sửa lỗi
- `docs`: Thay đổi documentation
- `style`: Format code (không ảnh hưởng logic)
- `refactor`: Refactor code
- `perf`: Cải thiện performance
- `test`: Thêm tests
- `build`: Thay đổi build system
- `ci`: Thay đổi CI config
- `chore`: Các thay đổi khác
- `revert`: Revert commit trước

## Shared Package (@quizapp/shared)

Package chứa các types và constants được share giữa mobile, backend, và admin.

### Types

| File                 | Mô tả                              |
| -------------------- | ---------------------------------- |
| `common.ts`          | Pagination, API Response types     |
| `user.ts`            | User, UserProfile, UserPreferences |
| `auth.ts`            | Login, Register, Social auth types |
| `quiz.ts`            | Category, Question, QuizSession    |
| `leaderboard.ts`     | Leaderboard entry, ranking types   |
| `multiplayer.ts`     | Room, Player, Socket events        |
| `achievement.ts`     | Achievement, progress types        |
| `daily-challenge.ts` | Daily challenge, streak types      |
| `notification.ts`    | Push notification types            |

### Constants

| Constant        | Mô tả                    |
| --------------- | ------------------------ |
| `API_ENDPOINTS` | Tất cả API endpoints     |
| `ERROR_CODES`   | Error codes chuẩn        |
| `APP_CONSTANTS` | App configuration values |
| `STORAGE_KEYS`  | Keys cho local storage   |

### Sử dụng

```typescript
// Import từ shared package
import { User, LoginRequest, API_ENDPOINTS } from "@quizapp/shared";

// Hoặc import cụ thể
import { User } from "@quizapp/shared/types";
import { ERROR_CODES } from "@quizapp/shared/constants";
```

## Commands

### Cài đặt dependencies

```bash
# Cài đặt tất cả dependencies
pnpm install

# Cài đặt cho package cụ thể
pnpm --filter @quizapp/shared add -D tsup
```

### Development

```bash
# Chạy tất cả apps
pnpm dev

# Chạy app cụ thể
pnpm --filter mobile dev
pnpm --filter backend dev
```

### Build

```bash
# Build tất cả
pnpm build

# Build package cụ thể
pnpm --filter @quizapp/shared build
```

### Linting

```bash
# Lint tất cả
pnpm lint

# Fix lint issues
pnpm lint:fix

# Format code
pnpm format
```

## Git Hooks

### pre-commit

Chạy tự động trước mỗi commit:

- ESLint fix trên staged files
- Prettier format trên staged files

### commit-msg

Kiểm tra commit message theo Conventional Commits format.

## Troubleshooting

### Lỗi "pnpm not found"

```bash
npm install -g pnpm
```

### Lỗi Turborepo cache

```bash
pnpm clean
pnpm install
```

### Lỗi TypeScript types không sync

```bash
pnpm --filter @quizapp/shared build
```

## Bước tiếp theo

- **Module 02**: Backend Core Setup (NestJS + Prisma)
- **Module 03**: Mobile Core Setup (Expo + Gluestack)
- **Module 04**: CI/CD Pipeline (GitHub Actions + EAS)

## Tham khảo

- [pnpm Workspaces](https://pnpm.io/workspaces)
- [Turborepo Documentation](https://turbo.build/repo/docs)
- [ESLint Flat Config](https://eslint.org/docs/latest/use/configure/configuration-files-new)
- [Conventional Commits](https://www.conventionalcommits.org/)
