# Production-Grade Auth Folder Structure

Complete feature-based architecture following enterprise patterns.

## Overview

```
src/features/auth/                          # Auth feature root
├── actions/                                # Server actions (HTTP handlers)
│   ├── register.ts                        # Registration orchestrator (Phase 1)
│   ├── verify-email.ts                    # Email verification (Phase 2)
│   ├── login.ts                           # (Existing)
│   └── social-auth.ts                     # (Existing)
│
├── services/                               # Business logic (Phase 3)
│   ├── auth.service.ts                    # Main orchestrator
│   ├── password.service.ts                # Password hashing/validation
│   └── token.service.ts                   # Token management (future)
│
├── repositories/                           # Data access layer (Phase 1)
│   ├── user.repository.ts                 # User operations (with transactions)
│   ├── verification-token.repository.ts   # (Future) Token operations
│   └── session.repository.ts              # (Existing)
│
├── validators/                             # Input validation (Phase 1)
│   ├── registration.validator.ts          # Backend registration validation
│   ├── password.validator.ts              # (Future)
│   └── email.validator.ts                 # (Future)
│
├── tokens/                                 # Token generation (Phase 1)
│   ├── verification-token.generator.ts    # Crypto-secure generation
│   ├── password-reset.generator.ts        # (Future)
│   └── token.types.ts                     # Type definitions
│
├── errors/                                 # Error handling (Phase 1)
│   ├── auth.errors.ts                     # Custom error classes
│   └── error-handler.ts                   # Error utilities (existing)
│
├── lib/                                    # Utilities & helpers
│   ├── auth-errors.ts                     # (Existing, will deprecate)
│   ├── response-builders.ts               # Response factories (Phase 1)
│   ├── audit-logger.ts                    # Audit trail (Phase 2)
│   ├── structured-logger.ts               # JSON logging (Phase 2)
│   ├── rate-limiter.ts                    # Upstash rate limiting (Phase 2)
│   ├── mail.ts                            # Email templates (Phase 1)
│   ├── auth-utils.ts                      # (Existing)
│   ├── callback-url.ts                    # (Existing)
│   ├── social-auth.ts                     # (Existing)
│   └── match-route.ts                     # (Existing)
│
├── mail/                                   # Email service
│   ├── email.queue.ts                     # Phase 1 queue (replaced by Phase 3)
│   ├── email.service.ts                   # (Future) Centralized service
│   └── templates/                         # Email templates
│       ├── verify-email.html
│       └── reset-password.html
│
├── jobs/                                   # Background jobs (Phase 3)
│   ├── inngest.ts                         # Inngest client + event schemas
│   ├── handlers.ts                        # Job handlers with retries
│   ├── email-queue.ts                     # (Future) Email job handler
│   └── cleanup-queue.ts                   # (Future) Cleanup handler
│
├── hooks/                                  # React hooks (UI layer)
│   ├── useRegister.ts                     # (Existing)
│   ├── useLogin.ts                        # (Existing)
│   ├── usePasswordStrength.ts             # (Existing)
│   └── useAuthContext.ts                  # (Future)
│
├── components/                             # React components (UI)
│   ├── RegisterForm.tsx                   # (Existing, updated)
│   ├── LoginForm.tsx                      # (Existing)
│   ├── AuthShell.tsx                      # (Existing)
│   ├── AuthError.tsx                      # (Existing)
│   ├── AuthSuccess.tsx                    # (Existing)
│   ├── AuthProviders.tsx                  # (Existing)
│   ├── PasswordStrength.tsx                # (Existing)
│   ├── SocialButtons.tsx                  # (Existing)
│   └── PasswordInput.tsx                  # (Existing)
│
├── config/                                 # Configuration
│   ├── app-routes.ts                      # (Existing) Route definitions
│   ├── access.ts                          # (Existing) Access control
│   ├── auth-config.ts                     # (Existing) Auth.js config
│   └── constants.ts                       # (Future) Auth constants
│
├── types/                                  # TypeScript types
│   ├── auth.types.ts                      # (Existing, updated)
│   ├── next-auth.d.ts                     # (Existing)
│   └── error.types.ts                     # (Future)
│
├── schemas/                                # Zod schemas
│   └── auth-schemas.ts                    # (Existing, enhanced in Phase 1)
│
├── server/                                 # Server utilities
│   ├── tokens.ts                          # (Existing, deprecated)
│   ├── auth-config.ts                     # (Existing)
│   └── verification-token.ts              # (Existing, deprecated)
│
├── middleware/                             # (Future) Auth middleware
│   ├── rate-limit.middleware.ts           # Rate limiting middleware
│   └── auth.middleware.ts                 # Auth checks
│
└── README.md                               # Documentation (Phase 1)
```

## File Organization Principles

### By Responsibility (Clean Architecture)

1. **Actions** (`actions/`)
   - Thin HTTP handlers
   - Route incoming requests to services
   - Format responses
   - <100 lines each

2. **Services** (`services/`)
   - Business logic
   - Domain operations
   - No HTTP concerns
   - Fully testable
   - ~200-300 lines each

3. **Repositories** (`repositories/`)
   - Data access abstraction
   - Database operations
   - Transaction management
   - Query optimization
   - ~150-250 lines each

4. **Validators** (`validators/`)
   - Input validation
   - Zod schemas
   - Custom validation rules
   - Reusable validation logic

5. **Errors** (`errors/`)
   - Custom error classes
   - Error categorization
   - Error mapping utilities

6. **Utilities** (`lib/`, `tokens/`, `mail/`)
   - Helper functions
   - External service integration
   - Pure functions

7. **UI Layer** (`components/`, `hooks/`)
   - React components
   - State management
   - User interactions

### By Technology Stack

- **Next.js**: `actions/`, `api/` routes, `middleware/`
- **Prisma**: `repositories/`
- **Zod**: `schemas/`, `validators/`
- **React**: `components/`, `hooks/`
- **Inngest**: `jobs/`
- **Upstash**: `lib/rate-limiter.ts`

## Phase-by-Phase Evolution

### Phase 1: Foundation

```
✓ actions/register.ts
✓ errors/auth.errors.ts
✓ tokens/verification-token.generator.ts
✓ validators/registration.validator.ts
✓ repositories/user.repository.ts
✓ lib/response-builders.ts
✓ lib/audit-logger.ts
✓ mail/email.queue.ts
```

### Phase 2: Hardening

```
✓ lib/rate-limiter.ts
✓ lib/structured-logger.ts
✓ actions/verify-email.ts
✓ api/cron/cleanup-tokens/route.ts
```

### Phase 3: Optimization

```
✓ services/auth.service.ts
✓ jobs/inngest.ts
✓ jobs/handlers.ts
✓ api/inngest/route.ts
```

## Import Paths

### Absolute Imports

```typescript
// ✅ Good
import { AuthService } from '@/features/auth/services/auth.service';
import { UserRepository } from '@/features/auth/repositories/user.repository';
import { registerUser } from '@/features/auth/actions/register';

// ❌ Avoid relative
import AuthService from '../../../../services/auth.service';
```

### Organized Imports

```typescript
// 1. External packages
import { z } from 'zod';
import bcrypt from 'bcryptjs';

// 2. App imports
import prisma from '@/lib/server/prisma/prisma';

// 3. Feature imports
import { AuthService } from '../services/auth.service';
import { AuthLogger } from '../lib/structured-logger';
import { AuthError } from '../errors/auth.errors';

// 4. Types
import type { AuthResponse } from '../types/auth.types';
```

## Deprecation Path

### Old Files to Remove

```
❌ src/features/auth/server/tokens.ts
❌ src/features/auth/server/verification-token.ts
❌ src/features/auth/lib/tokens.ts  (old version)
```

### Migration

```typescript
// OLD
import { generateVerificationToken } from '@/features/auth/server/tokens';

// NEW
import { generateVerificationToken } from '@/features/auth/tokens/verification-token.generator';
```

## Directory Size Guidelines

Keep directories focused:

- **≤ 10 files**: Simple, well-organized
- **10-20 files**: Consider subdirectories
- **> 20 files**: Split into multiple directories or features

Current status:

- `lib/`: 8 files (good)
- `components/`: 11 files (acceptable, focused)
- `hooks/`: 3 files (good)
- `actions/`: 4 files (good)

## Naming Conventions

### Files

```
service.ts       # Class exports (PascalCase class)
repository.ts    # Class exports (PascalCase class)
validator.ts     # Class exports (PascalCase class)
helpers.ts       # Function exports (camelCase functions)
types.ts         # Type/interface exports
constants.ts     # Exported constants
```

### Functions/Classes

```
AuthService         # Service class
UserRepository      # Repository class
ValidationError     # Error class
registerUser        # Server action
verifyEmail         # Server action
generateToken       # Utility function
```

### Types

```
AuthResponse<T>
AuthError
RegistrationInput
VerifyEmailResult
```

## Testing Structure (Future)

```
tests/
├── auth/
│   ├── services/
│   │   └── auth.service.test.ts
│   ├── repositories/
│   │   └── user.repository.test.ts
│   ├── validators/
│   │   └── registration.validator.test.ts
│   ├── actions/
│   │   └── register.test.ts
│   └── integration/
│       └── full-flow.test.ts
```

## Code Quality Standards

### Complexity

- Max 100 lines per function
- Max 300 lines per file (excluding tests)
- Max 15 parameters

### Coverage

- Services: ≥ 90% coverage
- Repositories: ≥ 85% coverage
- Actions: ≥ 80% coverage

### Documentation

- JSDoc for public APIs
- Inline comments for complex logic
- README in each major directory

---

**Last Updated:** May 7, 2026  
**Phase:** 3 Complete  
**Status:** Production Ready
