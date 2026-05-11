# 🏗️ AUTHENTICATION SYSTEM - COMPLETE ARCHITECTURE GUIDE

**Date:** May 9, 2026  
**Maintainer Guide:** For developers new to this codebase  
**Tech Stack:** Next.js 16 • React 19 • TypeScript • NextAuth v5 • Prisma • PostgreSQL • Redis

---

## TABLE OF CONTENTS

1. [Executive Summary](#executive-summary)
2. [High-Level Architecture](#high-level-architecture)
3. [Technology Stack Deep Dive](#technology-stack-deep-dive)
4. [Folder Structure Analysis](#folder-structure-analysis)
5. [Authentication Flows](#authentication-flows)
6. [Authorization & Permissions](#authorization--permissions)
7. [Database Design](#database-design)
8. [Session & JWT Strategy](#session--jwt-strategy)
9. [Middleware & Request Lifecycle](#middleware--request-lifecycle)
10. [Important Files To Read First](#important-files-to-read-first)
11. [Security Analysis](#security-analysis)
12. [Performance & Scalability](#performance--scalability)
13. [Problems Found](#problems-found)
14. [Refactoring Suggestions](#refactoring-suggestions)
15. [Final Verdict](#final-verdict)

---

## EXECUTIVE SUMMARY

### What is This System?

This is a **full-stack authentication & authorization system** for an e-commerce platform (clothing store). It manages:

- ✅ User registration & login
- ✅ Email verification
- ✅ Password reset
- ✅ OAuth (Google, GitHub)
- ✅ Role-based access control (RBAC)
- ✅ Session management
- ✅ Rate limiting
- ✅ Multi-locale support (EN/VI)

### Architecture Type

**Clean Architecture + DDD-inspired** with these layers:

```
UI Components (React)
    ↓
Server Actions + Middleware (Next.js)
    ↓
Use Cases + Services (Application Logic)
    ↓
Domain Logic (Business Rules)
    ↓
Infrastructure (Prisma, Redis, NextAuth)
```

### Key Decisions Made

| Decision                | Why                   | Impact                                  |
| ----------------------- | --------------------- | --------------------------------------- |
| JWT Sessions            | Stateless, scalable   | No DB lookup on every request           |
| Prisma ORM              | Type-safe, migrations | Generated types for auth models         |
| NextAuth v5             | Industry standard     | Callbacks for JWT/session customization |
| Upstash Redis           | Serverless, managed   | Rate limiting without infrastructure    |
| Feature-based structure | Clean boundaries      | Auth isolated in `src/features/auth/`   |
| TypeScript everywhere   | Type safety           | Prevents runtime errors in auth         |

### Current Status

| Aspect                 | Status         | Notes                              |
| ---------------------- | -------------- | ---------------------------------- |
| **Core Auth**          | ✅ Implemented | Login, register, OAuth             |
| **Email Verification** | ✅ Implemented | With Inngest queue                 |
| **Session Management** | ⚠️ Partial     | JWT only, no multi-device tracking |
| **Password Reset**     | 🔴 Schema only | Flow defined but not implemented   |
| **Authorization**      | ✅ Implemented | RBAC with scopes                   |
| **Rate Limiting**      | ✅ Available   | Upstash rate limiter configured    |
| **Audit Logging**      | ⚠️ Partial     | Logs exist but not persistent      |

---

## HIGH-LEVEL ARCHITECTURE

### System Overview Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    BROWSER / CLIENT                         │
│  (React + Next.js Client Components + React Hook Form)     │
└────────────────────┬────────────────────────────────────────┘
                     │
                     │ HTTP Request / Cookie
                     ↓
┌─────────────────────────────────────────────────────────────┐
│            NEXT.JS SERVER (Edge / Node)                     │
│                                                             │
│  1. MIDDLEWARE (src/proxy.ts)                              │
│     ├─ Check if route is public/protected/admin            │
│     ├─ Validate JWT token                                  │
│     ├─ Extract user permissions                            │
│     └─ Redirect if unauthorized                            │
│                                                             │
│  2. SERVER ACTIONS (src/features/auth/presentation/)       │
│     ├─ loginAction()                                       │
│     ├─ registerAction()                                    │
│     ├─ logoutAction()  [NOT IMPLEMENTED]                   │
│     └─ Send to use-cases                                   │
│                                                             │
│  3. USE CASES (src/features/auth/application/)             │
│     ├─ LoginUseCase → authenticate user                    │
│     ├─ RegisterUseCase → create user + send email          │
│     └─ Implement business logic                            │
│                                                             │
│  4. DOMAIN LOGIC (src/features/auth/domain/)               │
│     ├─ AuthUserAggregate → user state machine              │
│     ├─ Validation rules → password strength, email format  │
│     └─ Domain exceptions → DuplicateEmailError, etc        │
│                                                             │
│  5. INFRASTRUCTURE (src/features/auth/infrastructure/)     │
│     ├─ Repositories → Prisma queries                       │
│     ├─ Security → hashing, token generation                │
│     ├─ Logging → audit trail                               │
│     └─ Mail queue → email via Inngest                      │
└────────────────────┬────────────────────────────────────────┘
                     │
        ┌────────────┼────────────┐
        ↓            ↓            ↓
    ┌────────┐   ┌────────┐   ┌────────┐
    │ PostgreSQL   │ Redis  │ Inngest │
    │ (Prisma)     │ (Rate  │ (Email  │
    │              │ limit) │ Queue)  │
    └────────┘   └────────┘   └────────┘
```

### Data Flow: Authentication Request

```
Client Input (email, password)
        ↓
    Middleware
        ↓ (extract locale, check route)
    Server Action: loginAction()
        ↓ (receive credentials)
    LoginUseCase.execute()
        ↓ (orchestrate)
    ┌───────────────────────────┐
    │ 1. Validate input         │
    │ 2. Find user by email     │
    │ 3. Compare password hash  │
    │ 4. Create session         │
    │ 5. Sign JWT token         │
    │ 6. Set HTTP-only cookie   │
    │ 7. Return response        │
    └───────────────────────────┘
        ↓
    Browser receives JWT in cookie
        ↓
    On next request, middleware reads cookie
        ↓
    Validates JWT signature
        ↓
    Extracts user ID & scopes
        ↓
    Allows/denies access based on permissions
```

---

## TECHNOLOGY STACK DEEP DIVE

### 1. Next.js 16 App Router

**What it does:**

- File-based routing (folders = routes)
- Server components by default (secure!)
- Server Actions for form handling
- Middleware for auth checks
- Edge functions for global logic

**How it's used in this project:**

```
src/app/
├── layout.tsx              # Root layout with providers
├── globals.css             # Tailwind CSS
├── api/
│   ├── auth/[...nextauth]/ # NextAuth routes
│   ├── cron/cleanup-tokens # Scheduled tasks
│   └── inngest/route.ts    # Email queue webhook
├── [locale]/               # i18n support
    ├── (auth)/             # Login, signup (no navbar)
    │   ├── signin/page.tsx
    │   ├── signup/page.tsx
    │   └── layout.tsx      # Auth layout
    ├── (home)/             # Public pages
    │   ├── page.tsx        # Home page
    │   └── products/page.tsx
    ├── (admin)/            # Admin area (protected)
    │   └── dashboard/page.tsx
    └── layout.tsx          # Per-locale layout
```

**Key Decision:** Using App Router (not Pages Router) because:

- ✅ Server Components default = more secure by default
- ✅ Server Actions for form submissions
- ✅ Better for auth (no exposed API routes)
- ✅ Modern Next.js standard

---

### 2. NextAuth v5 (Beta)

**What it does:**

- Manages user sessions
- Handles OAuth providers (Google, GitHub)
- Issues & validates JWT tokens
- Provides `useSession()` hook for components
- Works with Prisma for database

**How it's configured:**

```typescript
// File: src/features/auth/server/auth-config.ts
export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma), // Use Prisma models
  secret: process.env.AUTH_SECRET, // Sign JWT
  session: { strategy: 'jwt' }, // Token-based (not DB sessions)

  providers: [
    Credentials({
      /* email/password */
    }),
    Google({ clientId, clientSecret }),
    GitHub({ clientId, clientSecret }),
  ],

  callbacks: {
    jwt() {
      /* customize token */
    },
    session() {
      /* customize session */
    },
  },
});
```

**Current Setup:**

| Aspect               | Value         | Implication                                                |
| -------------------- | ------------- | ---------------------------------------------------------- |
| **Session Strategy** | JWT           | No server-side session lookup, but can't invalidate tokens |
| **JWT Expiry**       | Not specified | Defaults to 30 days                                        |
| **Providers**        | Email + OAuth | Multiple auth methods                                      |
| **Adapter**          | Prisma        | Stores sessions, accounts in DB                            |

**⚠️ Critical Issue:** Using JWT without token rotation means:

- Stolen tokens can't be invalidated immediately
- User can't logout from other devices
- See [Security Analysis](#security-analysis) for details

---

### 3. Prisma ORM

**What it does:**

- Define database schema
- Generate type-safe query client
- Run migrations
- Relationships & constraints

**How it's used:**

```prisma
model User {
  id            String    @id @default(cuid())
  email         String    @unique          // Unique constraint
  password      String?                    // Optional (OAuth users)
  emailVerified DateTime?                  // Null until verified
  role          Role?     @relation(...)   // Many-to-one
  sessions      Session[] @relation(...)   // One-to-many
  accounts      Account[] @relation(...)   // OAuth accounts

  @@index([status])  // Indexed for queries
  @@map("users")     // Table name in DB
}

model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique             // Unique JWT
  userId       String
  expires      DateTime                     // When to reject
  user         User     @relation(...)      // Back reference
}

model VerificationToken {
  id        String    @id @default(cuid())
  token     String    @unique               // Email token (hashed)
  email     String
  expires   DateTime
  usedAt    DateTime?                       // One-time use
}
```

**Key Design Decisions:**

| Model                 | Decision                     | Why                                             |
| --------------------- | ---------------------------- | ----------------------------------------------- |
| **User**              | Soft delete (no `deletedAt`) | Actually has `deletedAt` field - good for audit |
| **Session**           | NextAuth stores here         | DB session backup if JWT fails                  |
| **VerificationToken** | One-time use with `usedAt`   | Prevents token replay attacks                   |
| **Account**           | Stores OAuth info            | Supports multi-provider linking                 |

---

### 4. TypeScript

**What it does:**

- Type-safe code (catches errors at compile time)
- Generated types from Prisma
- IntelliSense in IDE

**How it's used:**

```typescript
// Generated types from Prisma schema
import type { User, Session } from '@prisma/client';

// Custom auth types
interface UserWithCredentials {
  id: string;
  email: string;
  passwordHash: string;
  role: string;
  status: 'ACTIVE' | 'PENDING_EMAIL_VERIFICATION' | 'SUSPENDED';
}

// Function signatures
async function loginUser(
  email: string,
  password: string,
): Promise<{ sessionToken: string; expiresAt: Date }> {
  // TypeScript checks all types!
}
```

**Coverage:**

- ✅ Backend code fully typed
- ✅ API responses typed
- ✅ Prisma queries typed
- ✅ React components typed
- ⚠️ Some edge cases not typed (see problems section)

---

### 5. React Hook Form + Zod

**What they do:**

- Hook Form: Client-side form state management
- Zod: Schema validation & type inference

**How they work together:**

```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

// Define schema
const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

type LoginInput = z.infer<typeof LoginSchema>;

// Use in component
function LoginForm() {
  const { register, handleSubmit, formState: { errors } } = useForm<LoginInput>({
    resolver: zodResolver(LoginSchema),  // Validate with Zod
  });

  return <form onSubmit={handleSubmit(onSubmit)}>/* ... */</form>;
}
```

**Validation Layers:**

```
Client Layer (React Hook Form + Zod)
        ↓ (user clicks submit)
Server Layer (Server Action with loginServerSchema)
        ↓ (server validates again)
Domain Layer (RegistrationValidator with custom rules)
        ↓ (password strength, email not disposable)
Database Layer (unique constraint, not null checks)
```

This defense-in-depth approach is good! But Zod validation runs on both client AND server (duplication).

---

### 6. bcryptjs

**What it does:**

- Hash passwords (one-way encryption)
- Compare plaintext with hash (timing-safe)

**How it's used:**

```typescript
import bcrypt from 'bcryptjs';

// Hash password (cost: 12 rounds)
const hashed = await bcrypt.hash(password, 12);

// Compare password with hash
const isValid = await bcrypt.compare(inputPassword, hashed);
```

**Configuration:**

- Cost: **12** (good for 2026, adds ~100ms per hash)
- Algorithm: **bcrypt** (industry standard since 2006)
- Comparison: **timing-safe** (prevents timing attacks)

**Status:** ✅ Correctly configured

---

### 7. Upstash Redis + Rate Limit

**What they do:**

- Redis: In-memory cache/data store (serverless)
- Rate Limit: SDK for managing request limits

**How they're used:**

```typescript
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

// Create rate limiter
const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(5, '15 m'), // 5 requests per 15 minutes
});

// Check before login
const { success } = await ratelimit.limit(email);
if (!success) {
  return { error: 'Too many attempts' };
}
```

**Current Usage:**

- ✅ Available for registration rate limiting
- ⚠️ NOT enforced on login (critical gap!)
- ❌ No concurrent rate limit tracking per user

**Issues:**

- Rate limit check exists in `registerAction` but not `loginAction`
- No progressive backoff (fixed 15-minute window)
- No IP-based tracking (could fix brute force from different IPs)

---

### 8. Inngest

**What it does:**

- Background job queue (serverless)
- Reliable email delivery
- Automatic retries

**How it's used:**

```typescript
// Queue email job
await inngest.send({
  name: 'auth/verification-email',
  data: {
    userId: user.id,
    email: user.email,
    verificationToken: token,
  },
});

// Run async outside request
export const verificationEmailFn = inngest.createFunction(
  { id: 'send-verification-email' },
  { event: 'auth/verification-email' },
  async ({ event }) => {
    // Send email via SMTP
    await sendEmail({
      to: event.data.email,
      subject: 'Verify your email',
      html: `Click: ${verificationUrl}`,
    });
  },
);
```

**Current Status:**

- ✅ Job structure defined
- ⚠️ Email sending logic not fully implemented
- ❌ No retry strategy visible
- ❌ No webhook setup for bounce/complaint handling

---

## FOLDER STRUCTURE ANALYSIS

### Project Layout

```
clothing-store/
├── src/
│   ├── app/                 # Next.js App Router
│   ├── features/            # Feature modules
│   │   └── auth/           # ← MAIN AUTH SYSTEM
│   ├── components/          # Reusable UI components
│   ├── lib/                # Utilities
│   ├── generated/          # Prisma generated types
│   └── i18n/               # Internationalization
├── prisma/
│   ├── schema.prisma       # Database schema
│   └── migrations/         # Migration history
├── public/                 # Static assets
└── package.json
```

### src/features/auth/ Structure

```
src/features/auth/
│
├── DOMAIN LAYER ──────────────────────────────────────
│   ├── domain/
│   │   ├── aggregates/
│   │   │   └── auth-user.aggregate.ts    # User state machine
│   │   ├── entities/                     # ? (not used)
│   │   ├── value-objects/                # ? (not used)
│   │   ├── events/
│   │   │   └── auth-event.ts             # Event definitions
│   │   ├── contracts/
│   │   │   └── auth-response.types.ts    # DTO types
│   │   ├── validation/
│   │   │   ├── auth-schemas.ts           # Zod schemas
│   │   │   ├── registration.validator.ts # Custom validation
│   │   │   └── password-rules.ts         # Password strength
│   │   ├── exceptions/
│   │   │   ├── auth.exceptions.ts        # Custom errors
│   │   │   └── auth-error.codes.ts       # Error codes
│   │   ├── state-machines/
│   │   │   └── auth-state-machine.ts     # User lifecycle states
│   │   └── types.ts                      # Shared types
│
├── APPLICATION LAYER ─────────────────────────────────
│   ├── application/
│   │   ├── use-cases/
│   │   │   └── login.use-case.ts         # Login orchestration
│   │   ├── ports/                        # Interfaces (DI)
│   │   │   ├── user.repository.ts
│   │   │   ├── session.repository.ts
│   │   │   ├── password-hasher.port.ts
│   │   │   ├── event-bus.port.ts
│   │   │   └── metrics.port.ts
│   │   ├── context/
│   │   │   ├── request-context.ts        # Request metadata
│   │   │   └── security-context.ts       # User permissions
│   │   ├── dto/
│   │   │   ├── login-request.dto.ts
│   │   │   └── login-response.dto.ts
│   │   ├── auth.service.ts               # ← LEGACY (should be use-case)
│   │   └── policies/
│   │       └── auth.policy.ts            # Authorization rules
│
├── INFRASTRUCTURE LAYER ──────────────────────────────
│   ├── infrastructure/
│   │   ├── repositories/
│   │   │   ├── user.repository.ts        # Prisma queries
│   │   │   ├── user.repository.adapter.ts # Implements port
│   │   │   └── session.repository.ts
│   │   ├── security/
│   │   │   ├── hash.ts                   # bcryptjs wrapper
│   │   │   ├── token.generator.ts        # JWT token creation
│   │   │   ├── bcrypt-password-hasher.adapter.ts
│   │   │   └── rate-limiter.ts           # Upstash wrapper
│   │   ├── mail/
│   │   │   └── email.queue.ts            # Inngest integration
│   │   ├── logging/
│   │   │   └── structured-logger.ts      # Audit logging
│   │   ├── adapters/
│   │   │   └── login-use-case.factory.ts # Dependency injection
│   │   ├── telemetry/
│   │   │   ├── noop-event-bus.adapter.ts # Mock event bus
│   │   │   └── noop-metrics.adapter.ts   # Mock metrics
│   │   ├── providers/
│   │   │   └── nextauth.adapter.ts       # ? (possibly unused)
│   │   └── oauth/
│   │       └── social-auth.ts            # OAuth flow logic
│
├── PRESENTATION LAYER ────────────────────────────────
│   ├── presentation/
│   │   ├── actions/
│   │   │   ├── login.action.ts           # Server action
│   │   │   └── register.action.ts        # Server action
│   │   └── mappers/
│   │       └── auth-error.mapper.ts      # Error translation
│
├── UI LAYER ───────────────────────────────────────────
│   ├── ui/
│   │   ├── components/
│   │   │   ├── LoginForm.tsx
│   │   │   ├── RegisterForm.tsx
│   │   │   ├── SocialButtons.tsx
│   │   │   ├── PasswordInput.tsx
│   │   │   ├── PasswordStrength.tsx
│   │   │   └── Auth*.tsx (other components)
│   │   └── hooks/
│   │       ├── useLogin.ts               # Form logic
│   │       ├── useRegister.ts
│   │       └── usePasswordStrength.ts
│
├── CONFIGURATION ──────────────────────────────────────
│   ├── config/
│   │   ├── app-routes.ts                 # Route constants
│   │   ├── access.ts                     # Route permissions
│   │   ├── roles.ts                      # Role→scopes mapping
│   │   ├── api-routes.ts
│   │   └── api-access.ts
│
├── SHARED ────────────────────────────────────────────
│   ├── shared/
│   │   ├── validation/
│   │   │   ├── login-client.schema.ts    # Client-side Zod
│   │   │   ├── login-server.schema.ts    # Server-side Zod
│   │   │   ├── register-client.schema.ts
│   │   │   └── register-server.schema.ts
│   │   └── contracts/
│   │       └── auth.types.ts             # Shared DTOs
│
├── JOBS ───────────────────────────────────────────────
│   ├── jobs/
│   │   └── inngest/                      # Background jobs
│   │       └── verification-email.ts     # Email job
│
├── SERVER ────────────────────────────────────────────
│   ├── server/
│   │   └── auth-config.ts                # NextAuth setup
│
├── LIB ───────────────────────────────────────────────
│   ├── lib/
│   │   ├── auth-errors.ts                # Error handling
│   │   ├── auth-utils.ts
│   │   ├── auth-redirect.ts
│   │   └── match-route.ts                # Route matching
│
├── TYPES ──────────────────────────────────────────────
│   ├── types/
│   │   └── next-auth.d.ts                # NextAuth type augmentation
│
└── middleware equivalent
    └── src/proxy.ts                      # ← ENTRY POINT FOR AUTH
```

### Folder Assessment

#### ✅ CORRECT (Keep As-Is)

- `domain/` - Good separation of business rules
- `infrastructure/` - Proper abstraction of Prisma/Redis/Email
- `application/` - Use cases orchestrate flows
- `presentation/` - Server actions handle HTTP
- `ui/` - Components + hooks separate concerns
- `config/` - Routes and roles centralized

#### ⚠️ OVER-ENGINEERED (Can Simplify)

- `domain/contracts/` + `shared/contracts/` - DTOs duplicated!
- `domain/entities/` - Empty, not needed
- `domain/value-objects/` - Empty, not needed
- `infrastructure/providers/` - Seems unused
- `domain/events/` - Defined but not published anywhere
- `domain/state-machines/` - Seems unused

#### ❌ ANTI-PATTERNS (Should Refactor)

- `application/auth.service.ts` - Should be converted to use-case
- `adapters/login-use-case.factory.ts` - Creates one dependency configuration, overcomplicated for simple DI
- `telemetry/noop-*` - Mock implementations in production code (should be interfaces only)

---

## AUTHENTICATION FLOWS

### Flow 1: Login (Email + Password)

```
STEP 1: User submits login form
┌─────────────────────────────────────┐
│ Client: React component             │
│ <LoginForm email="" password="" />  │
│                                     │
│ Validation (React Hook Form + Zod)  │
│ ✓ Email is valid format             │
│ ✓ Password is not empty             │
└────────────┬────────────────────────┘
             │ form.handleSubmit()
             ↓
STEP 2: Server Action receives request
┌─────────────────────────────────────────────────────────┐
│ File: src/features/auth/presentation/actions/login.action.ts
│                                                         │
│ export async function loginAction(input) {              │
│   const headersList = await headers();                  │
│   const requestContext = createRequestContext({         │
│     ipAddress: headers.get('x-forwarded-for'),         │
│     userAgent: headers.get('user-agent'),              │
│   });                                                   │
│                                                         │
│   const securityContext = createSecurityContext({      │
│     roles: [],                                          │
│     permissions: [],                                    │
│     isAuthenticated: false,                             │
│   });                                                   │
│                                                         │
│   const loginUseCase = loginUseCaseFactory();           │
│   const result = await loginUseCase.execute(           │
│     input,                                              │
│     { requestContext, securityContext },               │
│   );                                                    │
│                                                         │
│   const cookieStore = await cookies();                 │
│   cookieStore.set('auth_session_token', result...);   │
│                                                         │
│   return result;                                        │
│ }                                                       │
└────────────┬────────────────────────────────────────────┘
             │ Call use-case
             ↓
STEP 3: Use Case Orchestrates Login
┌─────────────────────────────────────────────────────────┐
│ File: src/features/auth/application/use-cases/login.use-case.ts
│                                                         │
│ export class LoginUseCase {                             │
│   async execute(input, context) {                       │
│     1. Validate input                                   │
│        schema.safeParse(input)                          │
│        → throw ValidationError if invalid               │
│                                                         │
│     2. Find user by email                               │
│        userRepository.findByEmail(input.email)         │
│        → if not found, throw InvalidCredentialsError    │
│                                                         │
│     3. Check email verification status                  │
│        if (user.status === 'PENDING_EMAIL_VERIFICATION') │
│        → throw EmailNotVerifiedError                    │
│                                                         │
│     4. Compare password (bcryptjs, timing-safe)         │
│        passwordHasher.compare(password, user.hash)     │
│        → if !valid, throw InvalidCredentialsError       │
│                                                         │
│     5. Create session in database                       │
│        sessionRepository.createSession({...})          │
│        → returns { sessionId, sessionToken, expiresAt } │
│                                                         │
│     6. Publish event (for audit logging)                │
│        eventBus.publish('auth.login.success')           │
│                                                         │
│     7. Record metrics                                   │
│        metrics.increment('auth.login.success')          │
│                                                         │
│     8. Return response                                  │
│        return { sessionToken, expiresAt, userId, ... }  │
│   }                                                     │
│ }                                                       │
└────────────┬────────────────────────────────────────────┘
             │ Database queries via repositories
             ↓
STEP 4: Repository Layer (Prisma Queries)
┌─────────────────────────────────────────────────────────┐
│ File: src/features/auth/infrastructure/repositories/user.repository.ts
│                                                         │
│ const user = await prisma.user.findUnique({            │
│   where: { email: input.email.toLowerCase() },         │
│   include: { role: true },                              │
│ });                                                     │
│                                                         │
│ ✓ Returns { id, email, password, role, status }        │
│ ✓ Type-safe (Prisma generated types)                   │
│ ⚠️ N+1 risk if role has many relations                 │
└────────────┬────────────────────────────────────────────┘
             │
             ↓
STEP 5: Password Comparison
┌─────────────────────────────────────────────────────────┐
│ File: src/features/auth/infrastructure/security/hash.ts
│                                                         │
│ const valid = await bcrypt.compare(                     │
│   inputPassword,           // User's plaintext input   │
│   user.passwordHash,       // DB stored hash           │
│ );                                                     │
│                                                         │
│ Bcrypt internals:                                       │
│ • Extracts salt from stored hash                        │
│ • Re-hashes input password with same salt              │
│ • Timing-safe comparison (always ~100ms)               │
│ • Returns true/false                                    │
└────────────┬────────────────────────────────────────────┘
             │
             ↓
STEP 6: Session Creation & JWT Signing
┌─────────────────────────────────────────────────────────┐
│ Prisma creates session record:                          │
│                                                         │
│ INSERT INTO sessions (                                  │
│   sessionToken,    = "uuid-random-string"              │
│   userId,          = "user-id-from-db"                 │
│   expires,         = NOW() + 7 days                    │
│   createdAt        = NOW()                              │
│ )                                                       │
│                                                         │
│ NextAuth JWT signing (in server action):               │
│ • Token = JWT { userId, sessionId, role, scopes }      │
│ • Signed with AUTH_SECRET                              │
│ • Stored in HTTP-only cookie                           │
└────────────┬────────────────────────────────────────────┘
             │
             ↓
STEP 7: Response to Client
┌─────────────────────────────────────────────────────────┐
│ Set-Cookie: auth_session_token=<JWT>; HttpOnly; Secure │
│ Set-Cookie: expires=<date>                             │
│ Set-Cookie: sameSite=lax                                │
│                                                         │
│ Return JSON response:                                   │
│ {                                                       │
│   success: true,                                        │
│   userId: "user-id",                                    │
│   sessionId: "session-id",                              │
│   expiresAt: "2026-05-16T...",                          │
│ }                                                       │
└────────────┬────────────────────────────────────────────┘
             │
             ↓
STEP 8: Middleware on Next Request
┌─────────────────────────────────────────────────────────┐
│ File: src/proxy.ts (next.config.ts middleware)          │
│                                                         │
│ export async function proxy(req) {                      │
│   const session = await auth();  // Verify JWT cookie   │
│                                                         │
│   if (!session) {                                       │
│     return NextResponse.redirect('/signin');            │
│   }                                                     │
│                                                         │
│   const scopes = session.user.scopes;                   │
│   if (scopes.includes('admin') && isAdminRoute) {       │
│     // Allow                                            │
│   } else {                                              │
│     // Reject                                           │
│   }                                                     │
│ }                                                       │
└─────────────────────────────────────────────────────────┘

Timeline:
Client                Server                    Database
  │                     │                         │
  ├─ POST /login ──────→│                         │
  │                     ├─ Validate input          │
  │                     │                         │
  │                     ├─ Query user ────────────→│
  │                     │← User data              │
  │                     │                         │
  │                     ├─ Compare password       │
  │                     │                         │
  │                     ├─ Create session ───────→│
  │                     │← Session created       │
  │                     │                         │
  │                     ├─ Sign JWT              │
  │                     │                         │
  │←─ Set-Cookie(JWT)──│                         │
  │                     │                         │
  │ (JWT stored in browser's HttpOnly cookie)    │
  │                     │                         │
  ├─ GET /dashboard ───→│ (Cookie sent auto)      │
  │                     ├─ Verify JWT signature   │
  │                     ├─ Extract claims         │
  │                     ├─ Check scopes/roles     │
  │← Allow & render page│                         │
```

### Flow 2: Register (Sign Up)

```
STEP 1-2: Client submits form
(Same as login - validation, server action)

STEP 3: Registration Use-Case / Service
┌──────────────────────────────────────────────────────┐
│ File: src/features/auth/application/auth.service.ts
│                                                      │
│ export class AuthService {                           │
│   static async registerUser(input) {                 │
│     // 1. Validate (strong password, not disposable) │
│     await RegistrationValidator.validate(input);    │
│                                                      │
│     // 2. Hash password (bcrypt cost 12)             │
│     const hashedPassword = await hashPassword(...);  │
│                                                      │
│     // 3. Generate verification token (256-bit)      │
│     const { token, hashedToken, expiresAt } =       │
│       generateVerificationToken();                   │
│       // token = raw (send to email)                 │
│       // hashedToken = hashed (store in DB)          │
│                                                      │
│     // 4. Create user + verification token (atomic)  │
│     const { user, verificationToken } =             │
│       await UserRepository.createWithVerificationToken(
│         {                                            │
│           email: input.email,                        │
│           password: hashedPassword,                  │
│           name: input.name,                          │
│         },                                           │
│         { rawToken: token, hashedToken, expiresAt }, │
│       );                                             │
│                                                      │
│     // 5. Queue verification email (Inngest)         │
│     await enqueueVerificationEmail({                 │
│       userId: user.id,                               │
│       email: user.email,                             │
│       token: rawToken,  // Raw token in link         │
│       expiresAt,                                     │
│     });                                              │
│                                                      │
│     // 6. Log event                                  │
│     AuthLogger.info('user_registered', {...});      │
│                                                      │
│     return {                                         │
│       success: true,                                 │
│       userId: user.id,                               │
│       email: input.email,                            │
│       verificationToken: rawToken,  // For testing   │
│       verificationExpiresAt: expiresAt,              │
│     };                                               │
│   }                                                  │
│ }                                                    │
└──────────┬───────────────────────────────────────────┘
           │
           ↓
STEP 4: Atomic Transaction (Prisma)
┌──────────────────────────────────────────────────────┐
│ BEGIN TRANSACTION                                    │
│                                                      │
│ 1. INSERT INTO users (                               │
│      email, password, name, status='PENDING',        │
│      roleId=CUSTOMER                                 │
│    ) VALUES (...)                                    │
│    RETURNING id;                                     │
│                                                      │
│ 2. INSERT INTO verification_tokens (                 │
│      email, token, expires, userId                   │
│    ) VALUES (...)                                    │
│                                                      │
│ COMMIT (all-or-nothing)                              │
│                                                      │
│ ✓ If email exists: P2002 UNIQUE constraint error    │
│ ✓ Both succeed or both fail                          │
└──────────┬───────────────────────────────────────────┘
           │
           ↓
STEP 5: Queue Email via Inngest
┌──────────────────────────────────────────────────────┐
│ File: src/features/auth/infrastructure/mail/email.queue.ts
│                                                      │
│ await inngest.send({                                 │
│   name: 'auth/verification-email',                   │
│   data: {                                            │
│     userId: user.id,                                 │
│     email: user.email,                               │
│     verificationToken: rawToken,                     │
│   },                                                 │
│ });                                                  │
│                                                      │
│ Inngest will:                                        │
│ ✓ Send webhook to /api/inngest route                 │
│ ✓ Invoke email sending function                      │
│ ✓ Retry on failure                                   │
│ ✓ Persist log of attempt                             │
└──────────┬───────────────────────────────────────────┘
           │
           ↓
STEP 6: Email Verification Flow
┌──────────────────────────────────────────────────────┐
│ User receives email:                                 │
│ "Click here to verify: https://app.com/verify?      │
│  token=abc123def456"                                 │
│                                                      │
│ User clicks link:                                    │
│ GET /api/auth/verify?token=abc123def456              │
│                                                      │
│ Server:                                              │
│ 1. Hash token: sha256(abc123def456) = xyz789         │
│ 2. Find token in DB: WHERE token = xyz789            │
│ 3. Check expiration: now() < expires                 │
│ 4. Check one-time use: usedAt IS NULL               │
│ 5. Mark as used: UPDATE verification_tokens         │
│    SET usedAt = now()                                │
│ 6. Update user: UPDATE users                         │
│    SET emailVerified = now(),                        │
│        status = 'ACTIVE'                             │
│                                                      │
│ Result: Account activated!                           │
└──────────────────────────────────────────────────────┘

Full Lifecycle:
1. User enters form ────→ validation
2. Submit form ─────────→ registerAction (server)
3. Validate input ──────→ RegistrationValidator
4. Hash password ───────→ bcryptjs
5. Generate token ──────→ crypto.randomBytes(32)
6. Create DB record ────→ Atomic transaction
7. Queue email ────────→ Inngest
8. Send email ──────────→ SMTP (from Inngest job)
9. User clicks link ────→ Verify page
10. Mark as used ──────→ One-time token
11. Activate account ───→ emailVerified = now()
12. User can login ─────→ loginAction
```

### Flow 3: Session Lifecycle

```
After login, user has JWT in HTTP-only cookie.

NEXT PAGE LOAD:
┌────────────────────────────────────────────────────────────┐
│ 1. Browser automatically sends cookie with request         │
│    GET /dashboard                                           │
│    Cookie: auth_session_token=eyJhbG...                    │
│                                                             │
│ 2. Next.js middleware (proxy.ts) intercepts:                │
│    const session = await auth();                            │
│                                                             │
│ 3. NextAuth verifies JWT:                                   │
│    • Check signature (using AUTH_SECRET)                    │
│    • Check expiration (exp claim)                           │
│    • Extract claims (userId, role, scopes)                  │
│                                                             │
│ 4. If valid:                                                │
│    • session object created with user data                  │
│    • Middleware checks scopes against route                 │
│    • If authorized, request continues                       │
│                                                             │
│ 5. If invalid/expired:                                      │
│    • Return NextResponse.redirect('/signin')                │
│    • Browser redirected to login page                       │
│    • Cookie might be cleared by browser/NextAuth            │
└────────────────────────────────────────────────────────────┘

PROBLEM: JWT tokens can't be revoked!
┌────────────────────────────────────────────────────────────┐
│ Scenario: Attacker steals user's JWT                        │
│                                                             │
│ Option 1: Logout                                            │
│ • Client-side: Cookie is cleared                            │
│ • Server-side: Nothing happens (JWT is stateless!)          │
│ • Attacker's copy still works!                              │
│                                                             │
│ Option 2: Change password                                   │
│ • User's password is updated in DB                          │
│ • But JWT is still valid (doesn't check password!)          │
│ • Attacker still has access!                                │
│                                                             │
│ Option 3: Disable account                                   │
│ • User status → SUSPENDED                                   │
│ • Credentials provider checks status                        │
│ • But existing JWT isn't invalidated!                       │
│ • Attacker can use stale JWT until expiry (7 days!)         │
│                                                             │
│ ⚠️ CRITICAL: This is session fixation vulnerability!        │
└────────────────────────────────────────────────────────────┘

JWT Token Structure (decoded):
{
  "sub": "user-id-123",          // Subject (user ID)
  "email": "user@example.com",
  "name": "John Doe",
  "role": "CUSTOMER",
  "scopes": ["account", "cart"],
  "iat": 1715261000,             // Issued at (now)
  "exp": 1717939400,             // Expiration (7 days from now)
  "iss": "nextauth.js",          // Issuer
  "aud": "nextauth.js",          // Audience
}

Signed with: AUTH_SECRET using HS256
Sent in: HTTP-only cookie
Expires in: Default ~30 days (in auth-config, not specified)

CURRENT EXPIRY LOGIC:
Session callback doesn't specify maxAge:
callback: {
  async session({ session, token }) {
    // No maxAge here
    return session;
  }
}

Defaults to NextAuth default (30 days)
```

### Flow 4: OAuth Login (Google/GitHub)

```
STEP 1: User clicks "Login with Google"
┌───────────────────────────────────────────┐
│ Browser: <button onClick={() =>           │
│   signIn('google',                         │
│   { redirect: true, callbackUrl: '/' })  │
│ }>Google</button>                          │
└──────────┬────────────────────────────────┘
           │
           ↓
STEP 2: OAuth Redirect to Provider
┌───────────────────────────────────────────┐
│ NextAuth generates authorize URL:          │
│ https://accounts.google.com/o/oauth2/v2/auth?
│   client_id=<id>&
│   redirect_uri=<app>/api/auth/callback/google&
│   scope=openid+email+profile&
│   response_type=code&
│   ...                                      │
└──────────┬────────────────────────────────┘
           │
           ↓
STEP 3: User Grants Permission
┌───────────────────────────────────────────┐
│ Google shows consent screen                │
│ User: "Yes, let them access my profile"   │
│ Google redirects back:                     │
│ https://app.com/api/auth/callback/google?
│   code=4/abc123...&
│   state=random_string                     │
└──────────┬────────────────────────────────┘
           │
           ↓
STEP 4: NextAuth Backend Exchange Code
┌───────────────────────────────────────────┐
│ /api/auth/callback/google receives code   │
│                                            │
│ NextAuth does:                             │
│ 1. POST to Google token endpoint           │
│    exchange code → access_token            │
│                                            │
│ 2. GET user profile from Google API        │
│    using access_token                      │
│    Returns: { id, email, name, picture }   │
│                                            │
│ 3. Call signIn callback:                   │
│    authorize(credentials, req)             │
│    ✓ or ✗                                  │
└──────────┬────────────────────────────────┘
           │
           ↓
STEP 5: PrismaAdapter Handles Account Linking
┌───────────────────────────────────────────┐
│ PrismaAdapter automatically:               │
│                                            │
│ 1. Check if user exists (by email):        │
│    SELECT * FROM users                     │
│    WHERE email = 'user@gmail.com'          │
│                                            │
│ 2a. If EXISTS:                             │
│     Link OAuth account:                    │
│     INSERT INTO accounts (                 │
│       provider='google',                   │
│       providerAccountId=<google-id>,       │
│       userId=<existing-user-id>,           │
│       access_token,                        │
│       refresh_token                        │
│     )                                      │
│                                            │
│ 2b. If NOT EXISTS:                         │
│     Create new user:                       │
│     INSERT INTO users (                    │
│       email='user@gmail.com',              │
│       name='John Doe',                     │
│       image='https://...',                 │
│       emailVerified=now()  ← auto-verified │
│     )                                      │
│     Then link account (same as 2a)         │
│                                            │
│ 3. Call createUser event                   │
│    Sets role to CUSTOMER                   │
└──────────┬────────────────────────────────┘
           │
           ↓
STEP 6: JWT & Cookie
(Same as regular login - JWT created, cookie set)

FLOW DIAGRAM:
┌─────────┐
│ Browser │
└────┬────┘
     │ 1. signIn('google')
     ↓
┌──────────────────┐
│ OAuth Provider   │  2. Authorize?
│ (Google)         │ ← User grants
└────┬──────────────┘
     │ 3. Code back
     ↓
┌──────────────────────────┐
│ NextAuth Callback        │ 4. Exchange code
│ /api/auth/callback/google│ → Token endpoint
└────┬──────────────────────┘
     │ 5. Fetch user profile
     ↓
┌──────────────────────────┐
│ PrismaAdapter            │ 6. Link/create account
│ + DB                     │    in atomic transaction
└────┬──────────────────────┘
     │ 7. Create JWT
     ↓
┌─────────┐
│ Browser │ 8. Set cookie → Session
└─────────┘

⚠️ ISSUE: Auto-linking without user consent
If user@gmail.com registers with password,
then tries OAuth with same email,
they get auto-linked (no warning).
Could lead to account takeover if attacker
registers attacker@gmail.com via password,
then user tries OAuth with same email.
```

---

## AUTHORIZATION & PERMISSIONS

### Current System: RBAC (Role-Based Access Control)

```
Role Hierarchy:
┌────────────────────────────────────────┐
│ SUPER_ADMIN                            │
│ • Scopes: ['admin', 'staff', 'seller'] │
│ • Can: Everything                      │
├────────────────────────────────────────┤
│ ADMIN                                  │
│ • Scopes: ['admin', 'staff']           │
│ • Can: Manage store, products, orders  │
├────────────────────────────────────────┤
│ STAFF                                  │
│ • Scopes: ['staff']                    │
│ • Can: Process orders, manage products │
├────────────────────────────────────────┤
│ SELLER                                 │
│ • Scopes: ['seller']                   │
│ • Can: Manage own products             │
├────────────────────────────────────────┤
│ CUSTOMER                               │
│ • Scopes: ['account', 'cart']          │
│ • Can: Browse, buy, manage profile     │
└────────────────────────────────────────┘

Scope Format: String-based ('admin', 'staff', 'cart')
NOT permission-based ('user:delete', 'product:create')

This is simpler but less flexible.
Can't say "user can delete products < $100"
```

### Permission Flow

```
STEP 1: User Logs In
┌─────────────────────────────────────┐
│ Credentials.authorize() in auth-config
│                                     │
│ const user = await prisma.user.find│
│   where: { email },                 │
│   include: { role: true }           │
│ );                                  │
│                                     │
│ const roleName = user.role.name;    │
│ const scopes = ROLE_SCOPES[roleName]
│                                     │
│ return {                            │
│   id: user.id,                      │
│   email,                            │
│   name,                             │
│   role: roleName,                   │
│   scopes: [...scopes],              │
│ };                                  │
└─────────────────────────────────────┘

STEP 2: JWT Encoded
┌─────────────────────────────────────┐
│ jwt({ token, user }) callback       │
│                                     │
│ if (user) {                         │
│   token.id = user.id;               │
│   token.role = user.role;           │
│   token.scopes = user.scopes;  ← Embedded in JWT
│ }                                   │
│                                     │
│ return token;                       │
└─────────────────────────────────────┘

STEP 3: Session Created
┌─────────────────────────────────────┐
│ session({ session, token })callback │
│                                     │
│ session.user.id = token.id;         │
│ session.user.role = token.role;     │
│ session.user.scopes = token.scopes; │
│                                     │
│ return session;                     │
└─────────────────────────────────────┘

STEP 4: Middleware Checks Access
┌─────────────────────────────────────┐
│ File: src/proxy.ts                  │
│                                     │
│ const session = await auth();       │
│ const scopes = session.user.scopes; │
│                                     │
│ if (matchRoute(path, ADMIN_ROUTES)) │
│   if (!scopes.includes('admin')) {  │
│     redirect('/forbidden');         │
│   }                                 │
│ }                                   │
│                                     │
│ if (matchRoute(path,PROTECTED)) {   │
│   if (scopes.length === 0) {        │
│     redirect('/forbidden');         │
│   }                                 │
│ }                                   │
│                                     │
│ return intlProxy(req);              │
└─────────────────────────────────────┘

STEP 5: Route Protected
✓ Request allowed
✓ Page rendered
✓ Components can access scopes via useSession()

Components:
const { data: session } = useSession();
if (session.user.scopes.includes('admin')) {
  return <AdminPanel />;
}
```

### Route Protection

```
Routes in src/features/auth/config/access.ts

PUBLIC_ROUTES = [
  '/',              // Home
  '/terms',         // Legal
  '/privacy',       // Legal
]
→ Accessible without login

AUTH_ROUTES = [
  '/signin',        // Login page
  '/signup',        // Register page
  '/forgot-password', // Password reset
  '/error',
  '/forbidden',
]
→ Accessible without login
→ If logged in, redirect to /dashboard

PROTECTED_ROUTES = [
  '/dashboard',     // User dashboard
  '/account',       // Profile settings
  '/cart',          // Shopping cart
]
→ Require authentication (any user)

ADMIN_ROUTES = [
  '/admin',         // Admin panel
  '/admin/users',   // User management
  '/admin/products', // Product management
]
→ Require 'admin' scope

Middleware flow:
1. Check public routes → allow
2. Check auth routes → allow, or redirect if logged in
3. Check protected routes → require any scope
4. Check admin routes → require 'admin' scope
5. Else → require authentication
```

### Issues with Current Authorization

```
PROBLEM 1: Scopes embedded in JWT
┌──────────────────────────────────┐
│ If admin role permissions change: │
│ • Add new permission to admin     │
│ • Change ROLE_SCOPES config       │
│ • Existing JWT still has old      │
│   scopes until it expires!        │
│                                   │
│ Delayed permission update = dangerous
└──────────────────────────────────┘

PROBLEM 2: No fine-grained permissions
┌──────────────────────────────────┐
│ Can't express:                    │
│ • User can delete only own posts   │
│ • User can edit products < $100    │
│ • User can view only own orders    │
│                                   │
│ All-or-nothing: admin has ALL      │
│ admin permissions                  │
└──────────────────────────────────┘

PROBLEM 3: No permission verification
┌──────────────────────────────────┐
│ Route-level check in middleware:  │
│ ✓ Admin routes protected          │
│                                   │
│ But what about?                   │
│ • Server action permission check  │
│ • API endpoint permission check   │
│ • Component-level permission check│
│                                   │
│ Can be bypassed if developer      │
│ forgets to add check!              │
└──────────────────────────────────┘

SUGGESTED FIX:
┌──────────────────────────────────┐
│ 1. Make scopes database-backed    │
│    (not JWT-embedded)             │
│                                   │
│ 2. Add permission entity:         │
│    Permission {                   │
│      code: 'product:delete',      │
│      roles: [Role]                │
│    }                              │
│                                   │
│ 3. Add server action guard:       │
│    export async function          │
│    deleteProduct(id) {            │
│      const session = await auth() │
│      requirePermission(           │
│        session,                   │
│        'product:delete'           │
│      );                           │
│      // Safe now                  │
│    }                              │
└──────────────────────────────────┘
```

---

## DATABASE DESIGN

### Schema Overview

```prisma
User {
  id: string (CUID)
  email: string (UNIQUE)
  password: string? (nullable for OAuth)
  emailVerified: DateTime? (null until verified)
  name: string?
  image: string? (profile pic)
  status: UserStatus (ACTIVE | INACTIVE | BANNED)
  roleId: string? (FK to Role)

  Relations:
  • role: Role (many-to-one)
  • sessions: Session[] (one-to-many)
  • accounts: Account[] (one-to-many, OAuth)
  • verificationTokens: VerificationToken[] (one-to-many)
  • cartItems: CartItem[]
  • orders: Order[]
  • reviews: Review[]
  • activityLogs: ActivityLog[]
}

Session {
  id: string (CUID)
  sessionToken: string (UNIQUE)
  userId: string (FK)
  expires: DateTime
  createdAt: DateTime
  updatedAt: DateTime

  Indexes:
  • userId (for "find all sessions by user")
}

VerificationToken {
  id: string (CUID)
  email: string
  token: string (UNIQUE, hashed)
  expires: DateTime
  userId: string? (FK, nullable)
  usedAt: DateTime? (null = unused, has value = used)

  Indexes:
  • email (for resend logic)
  • expires (for cleanup queries)
  • userId (for finding tokens by user)
}

Account (NextAuth OAuth) {
  id: string
  userId: string (FK)
  provider: string ('google', 'github')
  providerAccountId: string (OAuth ID from provider)
  type: string ('oauth')
  access_token: string?
  refresh_token: string?
  expires_at: int? (UNIX timestamp)
  token_type: string?
  scope: string?

  Constraints:
  • UNIQUE(provider, providerAccountId)
  • FK to User onDelete Cascade
}

Role {
  id: string
  name: UserRole (enum, UNIQUE)
  permissions: Permission[] (many-to-many)
}

Permission {
  id: string
  code: string (UNIQUE, e.g., 'user:create')
  roles: Role[] (many-to-many)
}

ActivityLog {
  id: string
  userId: string? (FK, nullable for anonymous actions)
  action: string (e.g., 'LOGIN', 'UPDATE_PROFILE')
  actionType: ActivityType (enum)
  ip: string?
  userAgent: string?
  createdAt: DateTime

  Index:
  • userId (for "audit trail by user")
}
```

### Design Decisions

| Design                       | Why                                  | Trade-off                        |
| ---------------------------- | ------------------------------------ | -------------------------------- |
| **JWT Sessions**             | Stateless, scalable                  | Can't revoke immediately         |
| **Hashed Tokens**            | DB compromise won't expose tokens    | Extra CPU (hashing verification) |
| **One-time Tokens**          | Prevents replay attacks              | Extra column (`usedAt`)          |
| **emailVerified nullable**   | Track verification status separately | Need to check both fields        |
| **password nullable**        | Support OAuth-only accounts          | Extra null checks                |
| **activityLogs table**       | Audit trail                          | Extra queries, storage cost      |
| **Soft deletes (deletedAt)** | Preserve data for analytics          | Query filtering needed           |

### N+1 Query Risk Analysis

```
CURRENT CODE:
const user = await prisma.user.findUnique({
  where: { email },
  include: { role: true },  // ← Joins role table
});

This is 2 queries:
1. SELECT * FROM users WHERE email = ?
2. SELECT * FROM roles WHERE id = ?

ACCEPTABLE (2 queries for necessary data)

POTENTIAL N+1:
If we later do:
user.sessions.forEach(session => {
  console.log(session.expires);
});

We'd need:
1. SELECT * FROM users WHERE id = ?
2. SELECT * FROM sessions WHERE userId = ?

But currently we don't load sessions, so OK.

BIGGER RISK:
If we later add:
include: {
  role: {
    include: {
      permissions: true,  // Joins permissions
    }
  }
}

Then 3 queries:
1. users
2. roles
3. permissions

Currently we load just scopes, so OK.

RECOMMENDATION:
✓ Current queries are fine
✓ Use select() instead of include()
  to only get fields you need
⚠️ Watch for future eager loading
```

---

## SESSION & JWT STRATEGY

### Current Strategy: JWT Only

```
Session Storage: NOT in database
                 Only in browser cookie

JWT Token Structure:
{
  // Standard claims
  "sub": "user-id",
  "iat": 1715261000,
  "exp": 1717939400,  // ~30 days default

  // Custom claims
  "id": "user-id",
  "email": "user@example.com",
  "name": "John Doe",
  "role": "CUSTOMER",
  "scopes": ["account", "cart"],
}

Signed with: process.env.AUTH_SECRET (HS256)

Cookie Settings:
• httpOnly: true      (prevent XSS)
• secure: true        (HTTPS only)
• sameSite: 'lax'     (CSRF protection)
• maxAge: 7 days      (in loginAction)
                      (30 days in NextAuth default)
• path: '/'           (all routes)
```

### Verification Flow

```
On every request:
1. Middleware calls auth()
2. NextAuth reads cookie
3. Verifies signature: HMAC-SHA256(header.payload, SECRET)
4. Checks expiration: if (exp > now)
5. Extracts claims
6. Returns session object

✓ Fast (no DB lookup!)
✗ Can't revoke tokens
✗ Tokens valid until expiry
```

### Problems with JWT-Only

```
PROBLEM 1: Stolen Token Keeps Working
┌────────────────────────────┐
│ Attacker steals JWT        │
│ (XSS, network sniff, etc)  │
│                            │
│ User logs out:             │
│ • Cookie deleted locally   │
│ • But JWT still valid!     │
│ • Attacker's copy works    │
│ • Until expiry (7+ days)   │
└────────────────────────────┘

PROBLEM 2: No Logout Mechanism
┌────────────────────────────┐
│ User clicks "Logout"       │
│ • Browser deletes cookie   │
│ • But token exists!        │
│ • Security incident?       │
│ • Can't force logout       │
│ • Can't logout other       │
│   devices                  │
└────────────────────────────┘

PROBLEM 3: Permission Changes Delayed
┌────────────────────────────┐
│ Admin adds permission      │
│ to user role               │
│                            │
│ User's JWT still has       │
│ old permissions!           │
│                            │
│ Takes up to 30 days to     │
│ take effect                │
└────────────────────────────┘

PROBLEM 4: Token Rotation Missing
┌────────────────────────────┐
│ Best practice: rotate      │
│ tokens periodically        │
│                            │
│ Current: no rotation       │
│ Token valid for life       │
│ (until expiry)             │
│                            │
│ Increases attack window    │
└────────────────────────────┘
```

### Better Approach: Hybrid (JWT + DB Sessions)

```
RECOMMENDED:
1. Create session in database on login
2. Issue short-lived JWT (~15 min)
3. In JWT, store session ID (not user data)
4. On requests, verify JWT is valid
5. Load session from DB (permissions, etc)
6. If needed, invalidate session in DB
7. On logout, delete session from DB

Benefits:
✓ Can revoke tokens immediately
✓ Can logout from other devices
✓ Permissions updated instantly
✓ Better audit trail
✓ Better security overall

Trade-off:
✗ 1 extra DB query per request
✗ Need Redis for cache (mitigate cost)

Code Example:
// Login
const session = await createSession({
  userId: user.id,
  ipAddress: req.ip,
  userAgent: req.headers['user-agent'],
  expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000,
});

// JWT with session reference
const token = jwt.sign(
  { sessionId: session.id },
  SECRET,
  { expiresIn: '7d' }
);

// Verify on request
const decoded = jwt.verify(token, SECRET);
const session = await getSessionFromDB(decoded.sessionId);
if (!session || session.expiresAt < Date.now()) {
  redirect('/signin');
}

// Logout
await invalidateSession(sessionId);
```

---

## MIDDLEWARE & REQUEST LIFECYCLE

### Middleware Entry Point

```
File: src/proxy.ts (next.config.js middleware)

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // 1. BYPASS PUBLIC API
  if (isPublicApiRoute(pathname)) {
    return NextResponse.next();
  }

  // 2. ALLOW PUBLIC ROUTES
  if (matchRoute(pathname, PUBLIC_ROUTES)) {
    return intlProxy(req);
  }

  const locale = extractLocale(pathname);

  // 3. HANDLE AUTH ROUTES
  if (matchRoute(pathname, AUTH_ROUTES)) {
    const session = await auth();
    if (session) {
      // Logged in user trying to access /signin? Redirect to dashboard
      return NextResponse.redirect(
        new URL(getDashboardPath(locale), req.url)
      );
    }
    return intlProxy(req);
  }

  // 4. REQUIRE AUTHENTICATION FOR ALL OTHER ROUTES
  const session = await auth();
  if (!session) {
    return NextResponse.redirect(
      new URL(getSignInPath(locale), req.url)
    );
  }

  const scopes = session.user.scopes ?? [];

  // 5. ADMIN ROUTES REQUIRE 'admin' SCOPE
  if (matchRoute(pathname, ADMIN_ROUTES) && !scopes.includes('admin')) {
    return NextResponse.redirect(
      new URL(getForbiddenPath(locale), req.url)
    );
  }

  // 6. PROTECTED ROUTES REQUIRE AT LEAST ONE SCOPE
  if (matchRoute(pathname, PROTECTED_ROUTES) && scopes.length === 0) {
    return NextResponse.redirect(
      new URL(getForbiddenPath(locale), req.url)
    );
  }

  // 7. PASS THROUGH I18N MIDDLEWARE
  return intlProxy(req);
}

export const config = {
  matcher: ['/', '/(vi|en)/:path*'],
};
```

### Request Lifecycle Diagram

```
Request → Middleware (proxy.ts)
  │
  ├─ 1. Is it public API? → BYPASS
  │
  ├─ 2. Is it public route? → Allow with i18n
  │
  ├─ 3. Is it auth route?
  │    ├─ Not logged in? → Allow
  │    ├─ Logged in? → Redirect to dashboard
  │
  ├─ 4. Require auth
  │    ├─ Not logged in? → Redirect to signin
  │    ├─ Logged in? → Continue
  │
  ├─ 5. Is it admin route?
  │    ├─ Has 'admin' scope? → Continue
  │    ├─ No? → Redirect to forbidden
  │
  ├─ 6. Is it protected route?
  │    ├─ Has any scope? → Continue
  │    ├─ No scope? → Redirect to forbidden
  │
  └─ 7. Apply i18n
         │
         ↓
     Route handler / Page Component
         │
         ├─ Server Component runs (on server)
         │   ├─ Can access session via auth()
         │   ├─ Can use Prisma queries
         │   ├─ Can't access user input directly
         │
         ├─ Client Component rendered (in browser)
         │   ├─ Can use useSession() hook
         │   ├─ Can use useForm() for input
         │   ├─ Can call Server Actions
         │
         └─ Server Action (on form submit)
            ├─ Again checks auth() (middleware not called!)
            ├─ Validates input
            ├─ Calls use-case
            ├─ Returns response
            │
            ↓
        Response back to browser
```

### Session Availability

```
Where can you access user session?

✓ Middleware (src/proxy.ts):
  const session = await auth();
  // Full access to user data

✓ Server Components:
  import { auth } from '@/features/auth/server/auth-config';

  export default async function Dashboard() {
    const session = await auth();
    return <div>{session.user.name}</div>;
  }

✓ Server Actions:
  'use server';
  export async function updateProfile(data) {
    const session = await auth();
    // Can use session for authorization checks
  }

✓ API Routes:
  export async function POST(req) {
    const session = await auth();
    // Can check session
  }

✓ Client Components (LIMITED):
  'use client';
  import { useSession } from 'next-auth/react';

  export function UserMenu() {
    const { data: session } = useSession();
    // Returns session or null
  }

✗ Cannot access in:
  • Static generation (no request context)
  • Edge middleware (no auth() call possible)
```

---

## IMPORTANT FILES TO READ FIRST

### For New Maintainers - Reading Order

**Start Here (Understand the flow):**

1. `src/proxy.ts` (2 min read)
   - Route matching logic
   - Authentication check
   - Where requests go

2. `src/features/auth/config/access.ts` (1 min read)
   - Route classifications
   - Permission requirements

3. `src/features/auth/server/auth-config.ts` (5 min read)
   - NextAuth setup
   - JWT/session callbacks
   - OAuth providers

**Then (Implementation details):** 4. `src/features/auth/presentation/actions/login.action.ts` (3 min read)

- Server action entry point
- Context creation

5. `src/features/auth/application/use-cases/login.use-case.ts` (3 min read)
   - Core login logic
   - Dependency injection

6. `src/features/auth/infrastructure/repositories/user.repository.ts` (3 min read)
   - Prisma queries
   - Transaction handling

**Then (Supporting details):** 7. `src/features/auth/domain/exceptions/auth.exceptions.ts` (2 min read)

- Error hierarchy
- Custom exceptions

8. `src/features/auth/ui/hooks/useLogin.ts` (3 min read)
   - Client-side form logic
   - React Hook Form integration

**Finally (Configuration):** 9. `prisma/schema.prisma` (5 min read)

- Database models
- Relationships

10. `package.json` (1 min read)
    - Dependencies
    - Scripts

### Critical Configuration Files

| File                                 | Purpose                                 | Edit?               |
| ------------------------------------ | --------------------------------------- | ------------------- |
| `.env.local`                         | SECRET, database URL, OAuth credentials | ⚠️ Carefully        |
| `prisma/schema.prisma`               | Database models                         | 🔴 Migration needed |
| `src/features/auth/config/roles.ts`  | Role→scopes mapping                     | 🟡 Restart needed   |
| `src/features/auth/config/access.ts` | Route protection                        | ✅ HMR works        |
| `next.config.ts`                     | Next.js config                          | 🔴 Restart needed   |

### Key Dependencies

| Package              | Version     | Used For            |
| -------------------- | ----------- | ------------------- |
| next-auth            | v5.0.0-beta | Session, JWT, OAuth |
| @auth/prisma-adapter | v2.11.2     | DB session storage  |
| prisma               | v7.8.0      | ORM, migrations     |
| bcryptjs             | v3.0.3      | Password hashing    |
| @upstash/ratelimit   | v2.0.8      | Rate limiting       |
| zod                  | v4.3.6      | Validation          |
| react-hook-form      | v7.72.1     | Form state          |

---

## SECURITY ANALYSIS

### ✅ Good Security Practices

1. **Passwords hashed with bcrypt (cost 12)**
   - ✓ Industry standard
   - ✓ Timing-safe comparison
   - ✓ Proper cost (100ms per hash)

2. **Tokens hashed before storage**
   - ✓ Prevents token database leak
   - ✓ One-time use enforced

3. **HTTP-only cookies**
   - ✓ Prevents XSS token theft
   - ✓ Automatic with NextAuth

4. **SameSite=lax**
   - ✓ CSRF protection

5. **HTTPS enforced in production**
   - ✓ Secure flag set
   - ✓ In-transit encryption

### ⚠️ Security Warnings

| Issue                     | Severity | Notes                                      |
| ------------------------- | -------- | ------------------------------------------ |
| JWT not revokable         | CRITICAL | See [JWT Strategy](#session--jwt-strategy) |
| No rate limiting on login | HIGH     | Brute force possible                       |
| Timing attack risk        | HIGH     | Response time varies                       |
| No CSRF tokens            | HIGH     | State-changing endpoints exposed           |
| Weak input validation     | MEDIUM   | Some edge cases                            |
| Missing logout            | HIGH     | No session invalidation                    |
| OAuth auto-linking        | MEDIUM   | No consent flow                            |
| Sensitive logging         | LOW      | Passwords in logs possible                 |

### Recommended Security Hardening

```
PRIORITY 1 (CRITICAL):
□ Implement logout action
  → Invalidate JWT in DB

□ Add CSRF tokens
  → Require on login/register

□ Fix timing attacks
  → Constant-time responses

PRIORITY 2 (HIGH):
□ Add rate limiting
  → 5 attempts per 15 min
  → IP + email combination

□ Secure OAuth linking
  → Require user confirmation

□ Add password reset
  → Implement full flow

PRIORITY 3 (MEDIUM):
□ Audit logging
  → Persistent storage
  → Searchable by user/IP

□ Session tracking
  → Track device, IP, location
  → Allow device management

□ Breach detection
  → Alert on suspicious logins
  → Anomaly detection
```

---

## PERFORMANCE & SCALABILITY

### Current Performance Characteristics

```
Login Request Latency:
┌──────────────────────────────────────────────┐
│ 1. Middleware (route check):       ~1ms      │
│ 2. Query user by email:            ~5ms      │
│ 3. Bcrypt compare:                 ~100ms    │
│ 4. Create session:                 ~5ms      │
│ 5. JWT signing:                    ~1ms      │
│ 6. Set cookie:                     <1ms      │
├──────────────────────────────────────────────┤
│ TOTAL:                             ~112ms    │
│ (Fast! Bcrypt is intentionally slow)         │
└──────────────────────────────────────────────┘

Next Page Load Latency:
┌──────────────────────────────────────────────┐
│ 1. Read cookie:                    <1ms      │
│ 2. Verify JWT:                     ~1ms      │
│ 3. Middleware route check:         ~1ms      │
│ 4. Render page (depends on content)          │
├──────────────────────────────────────────────┤
│ TOTAL AUTH CHECK:                  ~3ms      │
│ (Very fast, no DB involved)                   │
└──────────────────────────────────────────────┘

Scaling to 10,000 concurrent users:
┌──────────────────────────────────────────────┐
│ Database Queries:                            │
│ • Each login: 2 queries                      │
│ • 100 logins/sec = 200 queries/sec           │
│ • With connection pooling: OK                │
│                                              │
│ JWT Verification:                            │
│ • No DB queries needed!                      │
│ • 10k users = 10k JWT verifications          │
│ • Done in-memory, very fast                  │
│                                              │
│ Redis Rate Limiting:                         │
│ • Upstash handles auto-scaling               │
│ • No infrastructure needed                   │
│                                              │
│ Bottleneck: Bcrypt (CPU-bound)               │
│ • Consider separate auth microservice        │
└──────────────────────────────────────────────┘
```

### Optimization Opportunities

```
QUICK WINS:
1. Add Redis caching for user roles
   └─ Saves ~1 DB query per login

2. Use database connection pooling
   └─ Built-in with Prisma (handled)

3. Implement JWT rotation
   └─ Refresh tokens every 15 min
   └─ More secure + can revoke

MEDIUM EFFORT:
4. Move password hashing to separate service
   └─ Prevents Node.js event loop blocking
   └─ Use dedicated Rust service for hashing

5. Implement session caching
   └─ Cache user permissions in Redis
   └─ TTL: 5 minutes
   └─ Invalidate on role change

ADVANCED:
6. Geo-distributed auth service
   └─ Auth at edge with service workers
   └─ Session sync via distributed cache
   └─ Lower latency for global users
```

---

## PROBLEMS FOUND

### Critical Issues

| #   | Issue                          | Severity | Impact                   | Effort |
| --- | ------------------------------ | -------- | ------------------------ | ------ |
| 1   | JWT not revokable              | CRITICAL | Indefinite hijacking     | 4h     |
| 2   | No logout action               | CRITICAL | Can't invalidate session | 1h     |
| 3   | No CSRF protection             | CRITICAL | Form hijacking           | 2h     |
| 4   | Timing attack risk             | CRITICAL | Email enumeration        | 1h     |
| 5   | Race condition in registration | CRITICAL | Duplicate email crash    | 30min  |

### High Priority Issues

| #   | Issue                     | Problem                 | Fix                       |
| --- | ------------------------- | ----------------------- | ------------------------- |
| 6   | No rate limiting on login | Brute force attacks     | Use Upstash limiter       |
| 7   | Missing password reset    | Account recovery broken | Implement full flow       |
| 8   | OAuth auto-linking        | Account hijacking risk  | Add confirmation flow     |
| 9   | No audit logging          | Compliance gap          | Persistent audit trail    |
| 10  | Weak input validation     | Security gap            | Comprehensive Zod schemas |

### Code Quality Issues

| #   | Issue                                 | Type         | Fix                              |
| --- | ------------------------------------- | ------------ | -------------------------------- |
| 11  | AuthService is god object             | Architecture | Convert to use-cases             |
| 12  | DI factory overcomplicated            | Code smell   | Simplify dependency setup        |
| 13  | Duplicate DTOs                        | Duplication  | Merge contracts/types            |
| 14  | Unused folders                        | Debt         | Remove entities/, value-objects/ |
| 15  | No permission verification in actions | Security     | Add guard middleware             |

---

## REFACTORING SUGGESTIONS

### Quick Wins (< 1 hour each)

```
QUICK WIN 1: Implement Logout
File: src/features/auth/presentation/actions/logout.action.ts

'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { signOut } from '@/features/auth/server/auth-config';

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete('next-auth.session-token');

  // Optional: invalidate session in DB if you switch to hybrid approach
  await signOut({ redirectTo: '/signin' });
}

Usage in component:
export function LogoutButton() {
  return (
    <button onClick={async () => await logoutAction()}>
      Logout
    </button>
  );
}
```

```
QUICK WIN 2: Fix Race Condition
File: src/features/auth/infrastructure/repositories/user.repository.ts

// Before:
if (existingUser) {
  throw new DuplicateEmailError(input.email);
}
const user = await tx.user.create({...});

// After:
try {
  const user = await tx.user.create({...});
  // Let DB unique constraint catch duplicates
} catch (error) {
  if (error.code === 'P2002') {
    throw new DuplicateEmailError(input.email);
  }
  throw error;
}
```

```
QUICK WIN 3: Add Rate Limiting to Login
File: src/features/auth/presentation/actions/login.action.ts

import { checkLoginRateLimit } from '../../infrastructure/security/rate-limiter';

export async function loginAction(input) {
  const identifier = `${context.ip}:${input.email}`;

  // Check rate limit
  const canAttempt = await checkLoginRateLimit(identifier);
  if (!canAttempt) {
    throw new RateLimitError('Too many attempts. Try again later.');
  }

  try {
    const result = await loginUseCase.execute(input, context);
    await recordLoginSuccess(identifier); // Clear counter
    return result;
  } catch (error) {
    throw error;
  }
}
```

### Medium Refactors (2-4 hours each)

```
MEDIUM REFACTOR 1: Convert AuthService to Use-Cases

Current structure:
├── AuthService (god object with 5 methods)

Better structure:
├── RegisterUseCase
│   ├── Validate input
│   ├── Hash password
│   ├── Create user
│   └── Queue email
├── VerifyEmailUseCase
│   ├── Find token
│   ├── Check expiration
│   └── Mark email verified
├── ResetPasswordUseCase
│   ├── Generate reset token
│   ├── Send email
│   └── Update password

Benefits:
✓ Single responsibility
✓ Easier to test
✓ Reusable logic
✓ Clear dependencies
```

```
MEDIUM REFACTOR 2: Simplify Dependency Injection

Current:
export function loginUseCaseFactory() {
  return new LoginUseCase({
    userRepository: new PrismaUserRepositoryAdapter(),
    sessionRepository: new PrismaSessionRepository(),
    passwordHasher: new BcryptPasswordHasherAdapter(),
    eventBus: new NoopEventBusAdapter(),
    metrics: new NoopMetricsAdapter(),
  });
}

Better:
// Just create it directly
const loginUseCase = new LoginUseCase(
  userRepository,
  sessionRepository,
  passwordHasher,
);

// Remove mock adapters - use real implementations
```

```
MEDIUM REFACTOR 3: Consolidate Type Definitions

Current:
├── domain/contracts/auth-response.types.ts
├── shared/contracts/auth.types.ts
├── types/next-auth.d.ts
└── domain/types.ts

Better:
├── shared/types/index.ts
│   ├── User types
│   ├── Auth types
│   ├── Error types
│   └── DTO types

Benefits:
✓ Single source of truth
✓ Easier to find types
✓ Less duplication
```

### Major Refactors (>4 hours)

```
MAJOR REFACTOR 1: Add Persistent Audit Logging

Create: src/lib/audit/audit-log.ts

export const auditLog = {
  async create(event: {
    action: string;  // 'LOGIN', 'LOGOUT', 'CREATE_USER'
    userId?: string;
    email?: string;
    ipAddress?: string;
    userAgent?: string;
    details?: Record<string, any>;
    status: 'SUCCESS' | 'FAILURE';
    errorCode?: string;
  }) {
    // Store in DB
    await prisma.auditLog.create({
      data: event,
    });

    // Alert if suspicious
    if (event.status === 'FAILURE' && event.action === 'LOGIN') {
      await checkForBruteForce(event.ipAddress);
    }
  },
};

Update: src/features/auth/application/use-cases/login.use-case.ts

async execute(input, context) {
  try {
    // ... login logic
    await auditLog.create({
      action: 'LOGIN',
      userId: user.id,
      email: input.email,
      ipAddress: context.requestContext.ipAddress,
      status: 'SUCCESS',
    });
    return result;
  } catch (error) {
    await auditLog.create({
      action: 'LOGIN',
      email: input.email,
      ipAddress: context.requestContext.ipAddress,
      status: 'FAILURE',
      errorCode: error.code,
    });
    throw error;
  }
}

Benefits:
✓ Compliance with regulations (GDPR, SOC2)
✓ Detect attacks in real-time
✓ Investigate security incidents
✓ User can see login history
```

```
MAJOR REFACTOR 2: Hybrid JWT + Database Sessions

Benefits:
✓ Can revoke tokens immediately
✓ Logout from other devices
✓ Update permissions instantly
✓ Better security overall

Changes needed:
1. Update Session model:
   model Session {
     id String @id @default(cuid())
     userId String
     sessionToken String @unique
     ipAddress String?
     userAgent String?
     deviceName String?
     lastActivity DateTime @updatedAt
     expiresAt DateTime

     user User @relation(fields: [userId], references: [id])
     @@index([userId])
     @@index([expiresAt])
   }

2. On login, create session
3. Issue JWT with sessionId
4. On request, verify session exists
5. On logout, delete session

Implementation effort: ~6 hours
```

---

## FINAL VERDICT

### Current State Assessment

**Strengths:**

- ✅ Clean architecture with clear layer separation
- ✅ Type-safe implementation (TypeScript everywhere)
- ✅ Good password hashing (bcrypt 12)
- ✅ Multiple auth methods (credentials + OAuth)
- ✅ Proper error handling with custom exceptions
- ✅ Scalable infrastructure (serverless)

**Weaknesses:**

- ⚠️ JWT not revokable (session fixation)
- ⚠️ No logout implementation
- ⚠️ Missing CSRF protection
- ⚠️ No rate limiting on login
- ⚠️ Incomplete password reset
- ⚠️ OAuth auto-linking not secured
- ⚠️ Some code duplication and over-engineering

### Production Readiness: 65/100

**Can use for:**

- ✅ Small to medium projects
- ✅ Internal tools
- ✅ Proof of concepts
- ✅ MVP launches

**Cannot use for:**

- ❌ High-security requirements
- ❌ Compliance-heavy industries (finance, healthcare)
- ❌ Enterprise production without hardening

### Effort to Production-Ready

| Phase           | Effort        | Priority |
| --------------- | ------------- | -------- |
| Critical fixes  | 8-10 hours    | ASAP     |
| High priority   | 12-16 hours   | Week 1   |
| Medium priority | 8-12 hours    | Week 2   |
| Code cleanup    | 6-8 hours     | Week 3   |
| **Total**       | **~40 hours** |          |

### Recommended Actions

**Immediate (Today):**

1. ✅ Review this guide
2. ✅ Understand the architecture
3. ✅ Identify your top 3 concerns

**This Week:**

1. Implement logout
2. Add rate limiting
3. Fix CSRF vulnerabilities

**Next Week:**

1. Complete password reset
2. Add audit logging
3. Secure OAuth linking

**Ongoing:**

1. Monitor security advisories
2. Update dependencies monthly
3. Review auth logs for attacks

---

## QUICK REFERENCE

### Important Paths

```
src/
├── proxy.ts .......................... Middleware entry point
├── features/auth/
│   ├── server/auth-config.ts ......... NextAuth setup
│   ├── presentation/actions/
│   │   ├── login.action.ts ........... Login endpoint
│   │   └── register.action.ts ........ Register endpoint
│   ├── application/use-cases/
│   │   └── login.use-case.ts ......... Login business logic
│   ├── infrastructure/repositories/
│   │   ├── user.repository.ts ........ Prisma queries
│   │   └── session.repository.ts .... Session DB
│   ├── domain/
│   │   ├── aggregates/auth-user.aggregate.ts
│   │   ├── exceptions/auth.exceptions.ts
│   │   ├── validation/
│   │   └── contracts/
│   ├── ui/
│   │   ├── components/
│   │   │   ├── LoginForm.tsx
│   │   │   └── RegisterForm.tsx
│   │   └── hooks/
│   │       ├── useLogin.ts
│   │       └── useRegister.ts
│   └── config/
│       ├── access.ts ................. Route protection
│       └── roles.ts .................. Role→scopes
├── app/
│   ├── api/auth/[...nextauth]/ ....... NextAuth routes
│   └── [locale]/(auth)/ .............. Auth pages
└── lib/
    ├── server/actions/auth.ts ........ Server utils
    └── client/providers/ ............. Context providers
```

### Key Env Variables

```
# NextAuth
AUTH_SECRET=<32-char random string>
AUTH_URL=http://localhost:3000  (dev)

# OAuth
AUTH_GOOGLE_ID=<client-id>
AUTH_GOOGLE_SECRET=<client-secret>
AUTH_GITHUB_ID=<client-id>
AUTH_GITHUB_SECRET=<client-secret>

# Database
DATABASE_URL=postgresql://user:pass@host/db
PRISMA_DATABASE_URL_SHADOW_DB=...

# Redis (Rate limiting)
UPSTASH_REDIS_REST_URL=...
UPSTASH_REDIS_REST_TOKEN=...

# Email
SMTP_HOST=...
SMTP_PORT=...
SMTP_USER=...
SMTP_PASS=...

# Inngest
INNGEST_EVENT_KEY=...
INNGEST_EVENT_SIGNING_KEY=...
```

---

**Document Created:** May 9, 2026  
**For:** New maintainers and architecture review  
**Status:** Comprehensive guide complete
