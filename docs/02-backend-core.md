# Module 02: Backend Core Setup

## Tổng Quan

Module này thiết lập Backend API cho QuizApp Mobile sử dụng:

- **NestJS** với **Fastify adapter** (nhanh hơn Express)
- **Prisma ORM** cho database PostgreSQL
- **class-validator** cho validation DTO
- **Swagger** cho API documentation
- **JWT** cho authentication

## Cấu Trúc Thư Mục

```
apps/backend/
├── prisma/
│   ├── schema.prisma          # Database schema
│   └── seed.ts                 # Seed data
├── src/
│   ├── app/
│   │   ├── app.module.ts       # Root module
│   │   ├── app.controller.ts   # Health check endpoints
│   │   └── app.service.ts      # App service
│   ├── common/
│   │   ├── decorators/         # Custom decorators
│   │   │   ├── current-user.decorator.ts
│   │   │   └── public.decorator.ts
│   │   ├── dto/                # Shared DTOs
│   │   │   └── pagination.dto.ts
│   │   ├── exceptions/         # Custom exceptions
│   │   │   └── business.exception.ts
│   │   ├── filters/            # Exception filters
│   │   │   └── http-exception.filter.ts
│   │   ├── guards/             # Auth guards
│   │   │   └── jwt-auth.guard.ts
│   │   └── interceptors/       # Response interceptors
│   │       ├── transform.interceptor.ts
│   │       └── logging.interceptor.ts
│   ├── config/
│   │   ├── app.config.ts       # App configuration
│   │   └── validation.schema.ts # Env validation
│   ├── prisma/
│   │   ├── prisma.module.ts    # Prisma module
│   │   └── prisma.service.ts   # Prisma service
│   └── main.ts                 # Entry point
├── test/
│   ├── app.e2e-spec.ts         # E2E tests
│   └── jest-e2e.json           # E2E config
├── .env.example                # Environment template
├── docker-compose.yml          # Local PostgreSQL
├── nest-cli.json               # NestJS CLI config
├── package.json                # Dependencies
└── tsconfig.json               # TypeScript config
```

## Cài Đặt và Chạy

### 1. Cài đặt dependencies

```bash
# Từ root project
pnpm install

# Hoặc chỉ backend
cd apps/backend
pnpm install
```

### 2. Khởi động PostgreSQL

```bash
cd apps/backend

# Khởi động PostgreSQL
docker-compose up -d

# Với pgAdmin (tùy chọn)
docker-compose --profile tools up -d
```

**Thông tin kết nối:**
- Host: `localhost`
- Port: `5432`
- Database: `quizapp`
- Username: `quizapp`
- Password: `quizapp123`

**pgAdmin (nếu bật profile tools):**
- URL: `http://localhost:5050`
- Email: `admin@quizapp.com`
- Password: `admin123`

### 3. Thiết lập Environment

```bash
# Copy file .env.example
cp .env.example .env

# Chỉnh sửa các giá trị nếu cần
```

**Các biến môi trường quan trọng:**

| Biến | Mô tả | Mặc định |
|------|-------|----------|
| `DATABASE_URL` | PostgreSQL connection string | Required |
| `JWT_SECRET` | Secret key cho access token | Required (min 32 chars) |
| `JWT_REFRESH_SECRET` | Secret key cho refresh token | Required (min 32 chars) |
| `PORT` | Port server | 3000 |
| `CORS_ORIGINS` | Allowed origins | localhost |
| `SWAGGER_ENABLED` | Bật/tắt Swagger | true |

### 4. Khởi tạo Database

```bash
# Generate Prisma Client
pnpm db:generate

# Chạy migrations
pnpm db:migrate

# Seed dữ liệu test
pnpm db:seed
```

### 5. Chạy Server

```bash
# Development mode (hot reload)
pnpm dev

# Production mode
pnpm build
pnpm start:prod
```

Server sẽ chạy tại: `http://localhost:3000`

## API Documentation

Swagger UI có sẵn tại: `http://localhost:3000/api/docs`

### Endpoints cơ bản

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/api` | Thông tin API |
| GET | `/api/v1/health` | Health check |

## Prisma Schema

### User Model

```prisma
model User {
  id              String    @id @default(cuid())
  email           String    @unique
  username        String    @unique
  displayName     String?
  avatarUrl       String?
  password        String?   // Nullable for social login
  isEmailVerified Boolean   @default(false)

  // Social login
  googleId        String?   @unique
  facebookId      String?   @unique
  appleId         String?   @unique

  // Timestamps
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
  lastLoginAt     DateTime?

  // Relations
  refreshTokens   RefreshToken[]
}
```

### RefreshToken Model

```prisma
model RefreshToken {
  id          String    @id @default(cuid())
  token       String    @unique
  userId      String
  deviceInfo  String?   // Device information
  ipAddress   String?
  expiresAt   DateTime
  createdAt   DateTime  @default(now())
  revokedAt   DateTime?

  user        User      @relation(...)
}
```

## Scripts

| Script | Mô tả |
|--------|-------|
| `pnpm dev` | Chạy development server |
| `pnpm build` | Build production |
| `pnpm start:prod` | Chạy production server |
| `pnpm test` | Chạy unit tests |
| `pnpm test:e2e` | Chạy E2E tests |
| `pnpm db:generate` | Generate Prisma Client |
| `pnpm db:migrate` | Chạy migrations |
| `pnpm db:studio` | Mở Prisma Studio |
| `pnpm db:seed` | Seed dữ liệu |
| `pnpm db:reset` | Reset database |

## Common Module

### Decorators

**@CurrentUser()** - Lấy user hiện tại từ request
```typescript
@Get('profile')
getProfile(@CurrentUser() user: User) {
  return user;
}

// Hoặc lấy field cụ thể
@Get('my-id')
getMyId(@CurrentUser('id') userId: string) {
  return userId;
}
```

**@Public()** - Đánh dấu route công khai (không cần auth)
```typescript
@Public()
@Get('public-data')
getPublicData() {
  return { message: 'This is public' };
}
```

### DTOs

**PaginationDto** - Pagination parameters
```typescript
@Get('items')
findAll(@Query() pagination: PaginationDto) {
  const { skip, take } = pagination;
  // ...
}
```

**PaginatedResponseDto** - Paginated response format
```typescript
return new PaginatedResponseDto(items, total, page, limit);
// {
//   data: [...],
//   meta: { total, page, limit, totalPages, hasNextPage, hasPreviousPage }
// }
```

### Exceptions

```typescript
// Business logic error
throw new BusinessException('Insufficient balance', 'INSUFFICIENT_BALANCE');

// Resource not found
throw new ResourceNotFoundException('User', userId);

// Duplicate resource
throw new DuplicateResourceException('User', 'email');

// Invalid credentials
throw new InvalidCredentialsException();

// Invalid/expired token
throw new InvalidTokenException('Refresh token');
```

## Response Format

Tất cả responses được wrap trong format chuẩn:

**Success Response:**
```json
{
  "success": true,
  "data": { ... },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

**Error Response:**
```json
{
  "statusCode": 400,
  "message": "Error message",
  "error": "Bad Request",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "path": "/api/v1/users",
  "method": "POST"
}
```

## Best Practices

### 1. Sử dụng Shared Types

```typescript
import { User, LoginRequest } from '@quizapp/shared';
```

### 2. Validation với class-validator

```typescript
import { IsEmail, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(3)
  username: string;
}
```

### 3. API Versioning

API sử dụng URI versioning: `/api/v1/...`

```typescript
@Controller({ version: '1' })
export class UsersController { ... }
```

### 4. Testing

```bash
# Unit tests
pnpm test

# E2E tests
pnpm test:e2e

# Coverage
pnpm test:cov
```

## Bước Tiếp Theo

Sau khi hoàn thành Module 02, tiến hành:

1. **Module 03: Authentication** - Đăng ký, đăng nhập, social login
2. **Module 04: User Management** - Profile, settings
3. **Module 05: Quiz Core** - Categories, questions, quiz logic

## Troubleshooting

### Lỗi "Cannot connect to database"

1. Kiểm tra PostgreSQL đang chạy:
```bash
docker-compose ps
```

2. Kiểm tra DATABASE_URL trong .env

3. Reset và migrate lại:
```bash
pnpm db:reset
```

### Lỗi Prisma Client

```bash
# Regenerate client
pnpm db:generate

# Clear cache nếu cần
rm -rf node_modules/.prisma
pnpm install
```

### Port đã được sử dụng

Đổi PORT trong .env hoặc kill process:
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Linux/Mac
lsof -i :3000
kill -9 <PID>
```
