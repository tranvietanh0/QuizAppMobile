# Module 04: CI/CD Pipeline

## Tong quan

Document nay huong dan cau hinh CI/CD pipeline cho QuizApp Mobile su dung GitHub Actions va EAS Build.

## Muc luc

1. [Cau truc Workflow](#cau-truc-workflow)
2. [Thiet lap EAS Account](#thiet-lap-eas-account)
3. [Cau hinh GitHub Secrets](#cau-hinh-github-secrets)
4. [Build Profiles](#build-profiles)
5. [Trigger Manual Builds](#trigger-manual-builds)
6. [Troubleshooting](#troubleshooting)

---

## Cau truc Workflow

### 1. CI Workflow (`ci.yml`)

Workflow chinh cho Continuous Integration, chay khi:
- Push len branch `main`
- Tao Pull Request vao `main`

**Jobs:**

| Job | Mo ta | Dependencies |
|-----|-------|--------------|
| `lint` | Kiem tra code quality voi ESLint | - |
| `typecheck` | Kiem tra TypeScript | - |
| `test` | Chay unit tests cho backend | - |
| `build` | Build tat ca packages | lint, typecheck |
| `e2e` | Chay E2E tests (chi tren main) | build |

**Services su dung:**
- PostgreSQL 16 (cho test database)
- Redis 7 (cho caching)

### 2. Mobile Preview Workflow (`mobile-preview.yml`)

Tao preview builds cho Pull Requests.

**Trigger:**
- PR duoc gan label `build-preview`
- Thay doi trong `apps/mobile/` hoac `packages/shared/`

**Features:**
- Build APK cho Android
- Tu dong comment link download tren PR
- iOS simulator build (khi co label `build-ios`)

### 3. Mobile Production Workflow (`mobile-production.yml`)

Build production cho release.

**Trigger:**
- Push len `main` (build preview)
- Tao GitHub Release (build production + submit)
- Manual dispatch (tuy chon platform va submit)

**Features:**
- Build Android (AAB cho Play Store)
- Build iOS (IPA cho App Store)
- Tu dong submit len stores (optional)
- Upload assets len GitHub Release

---

## Thiet lap EAS Account

### Buoc 1: Tao Expo Account

1. Truy cap [expo.dev](https://expo.dev)
2. Dang ky tai khoan moi hoac dang nhap
3. Tao organization (neu can)

### Buoc 2: Cai dat EAS CLI

```bash
# Cai dat global
npm install -g eas-cli

# Dang nhap
eas login
```

### Buoc 3: Cau hinh Project

```bash
cd apps/mobile

# Lien ket voi Expo project
eas init

# Cau hinh credentials (Android)
eas credentials
```

### Buoc 4: Tao Access Token

1. Truy cap [expo.dev/accounts/[account]/settings/access-tokens](https://expo.dev/settings/access-tokens)
2. Click "Create Token"
3. Dat ten (vd: "GitHub Actions")
4. Copy token va luu lai

---

## Cau hinh GitHub Secrets

### Secrets bat buoc

| Secret | Mo ta | Cach lay |
|--------|-------|----------|
| `EXPO_TOKEN` | EAS authentication token | Expo Settings > Access Tokens |

### Secrets cho Store Submission

| Secret | Mo ta | Cach lay |
|--------|-------|----------|
| `GOOGLE_PLAY_SERVICE_ACCOUNT` | JSON key cho Play Store | Google Cloud Console |
| `APPLE_ID` | Apple ID email | Apple Developer |
| `APPLE_APP_SPECIFIC_PASSWORD` | App-specific password | Apple ID Settings |

### Secrets tuy chon

| Secret | Mo ta | Cach lay |
|--------|-------|----------|
| `TURBO_TOKEN` | Turborepo remote caching | Vercel Dashboard |
| `CODECOV_TOKEN` | Coverage reporting | Codecov Settings |

### Cach them Secret vao GitHub

1. Vao repository Settings
2. Click "Secrets and variables" > "Actions"
3. Click "New repository secret"
4. Nhap ten va gia tri
5. Click "Add secret"

```
Repository Settings
    └── Secrets and variables
        └── Actions
            └── New repository secret
                ├── Name: EXPO_TOKEN
                └── Value: expo_xxxxx
```

---

## Build Profiles

### File `eas.json`

```json
{
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal",
      "android": { "buildType": "apk" }
    },
    "production": {
      "distribution": "store",
      "android": { "buildType": "app-bundle" }
    }
  }
}
```

### Development Profile

- **Muc dich:** Development voi dev client
- **Output:** APK (debug)
- **Distribution:** Internal (team only)
- **Su dung:** Test features moi

```bash
eas build --profile development --platform android
```

### Preview Profile

- **Muc dich:** Testing truoc khi release
- **Output:** APK
- **Distribution:** Internal
- **Su dung:** QA testing, PR reviews

```bash
eas build --profile preview --platform android
```

### Production Profile

- **Muc dich:** Release len stores
- **Output:** AAB (Android), IPA (iOS)
- **Distribution:** Store
- **Su dung:** Production release

```bash
eas build --profile production --platform android
```

---

## Trigger Manual Builds

### 1. Tu GitHub Actions

1. Vao tab "Actions"
2. Chon "Mobile Production Build"
3. Click "Run workflow"
4. Chon cac options:
   - **Platform:** android / ios / all
   - **Submit:** true/false
   - **Profile:** production / preview

### 2. Tu Command Line

```bash
cd apps/mobile

# Build preview APK
eas build --profile preview --platform android

# Build production AAB
eas build --profile production --platform android

# Build va submit
eas build --profile production --platform android --auto-submit
```

### 3. Tu PR Labels

1. Tao PR voi changes trong `apps/mobile/`
2. Them label `build-preview`
3. Workflow tu dong chay va comment link download

---

## Environment Variables

### Cau hinh trong eas.json

```json
{
  "build": {
    "preview": {
      "env": {
        "APP_ENV": "preview",
        "API_URL": "https://api-staging.quizapp.com"
      }
    },
    "production": {
      "env": {
        "APP_ENV": "production",
        "API_URL": "https://api.quizapp.com"
      }
    }
  }
}
```

### Su dung trong code

```typescript
// app.config.ts
export default {
  extra: {
    apiUrl: process.env.API_URL,
    appEnv: process.env.APP_ENV,
  },
};

// Trong component
import Constants from 'expo-constants';
const apiUrl = Constants.expoConfig?.extra?.apiUrl;
```

---

## Quy trinh Release

### 1. Feature Development

```
feature-branch -> PR -> CI checks -> Code review -> Merge to main
```

### 2. Preview Testing

```
PR + label "build-preview" -> Build APK -> QA testing
```

### 3. Production Release

```
Create GitHub Release -> Build production -> Submit to stores
```

### Chi tiet quy trinh

1. **Tao Release tag:**
   ```bash
   git tag v1.0.0
   git push origin v1.0.0
   ```

2. **Tao GitHub Release:**
   - Vao Releases > Draft a new release
   - Chon tag `v1.0.0`
   - Them release notes
   - Publish release

3. **Workflow tu dong:**
   - Build production Android/iOS
   - Submit len stores (neu cau hinh)
   - Upload APK len GitHub Release

---

## Troubleshooting

### Loi thuong gap

#### 1. "EXPO_TOKEN is not set"

**Nguyen nhan:** Chua cau hinh secret

**Giai phap:**
1. Kiem tra secret da duoc them vao GitHub
2. Ten phai chinh xac: `EXPO_TOKEN`
3. Token chua het han

#### 2. "Build failed: Credentials not found"

**Nguyen nhan:** Chua setup credentials cho EAS

**Giai phap:**
```bash
cd apps/mobile
eas credentials
# Chon platform va tao credentials moi
```

#### 3. "Cannot find module '@quizapp/shared'"

**Nguyen nhan:** Shared package chua duoc build

**Giai phap:**
- Workflow da tu build shared package
- Neu local, chay: `pnpm turbo build --filter=@quizapp/shared`

#### 4. "Google Play submission failed"

**Nguyen nhan:** Service account khong dung

**Giai phap:**
1. Kiem tra JSON key hop le
2. Service account co quyen "Release Manager"
3. App da duoc tao tren Play Console

### Debug Tips

1. **Xem build logs:**
   ```bash
   eas build:list
   eas build:view [BUILD_ID]
   ```

2. **Chay local build:**
   ```bash
   eas build --local --profile preview --platform android
   ```

3. **Kiem tra workflow logs:**
   - GitHub Actions > Workflow run > Job > Step

---

## Tham khao

- [EAS Build Documentation](https://docs.expo.dev/build/introduction/)
- [EAS Submit Documentation](https://docs.expo.dev/submit/introduction/)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Turborepo CI Guide](https://turbo.build/repo/docs/ci)

---

## Checklist Setup

- [ ] Tao Expo account
- [ ] Cai dat EAS CLI va dang nhap
- [ ] Chay `eas init` trong apps/mobile
- [ ] Tao EXPO_TOKEN va them vao GitHub Secrets
- [ ] (Optional) Setup Google Play Service Account
- [ ] (Optional) Setup Apple credentials
- [ ] Test build voi `eas build --profile preview`
- [ ] Test workflow voi PR co label `build-preview`
