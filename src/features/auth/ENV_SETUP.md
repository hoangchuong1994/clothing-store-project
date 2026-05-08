# Environment Setup Guide

Complete environment configuration for all three phases.

## Phase 1: Core Security

### Required Variables

```env
# App Configuration
NEXT_PUBLIC_APP_URL=https://your-domain.com
NODE_ENV=production

# Email Service
SMTP_ACCOUNT=your-email@gmail.com
SMTP_PASSWORD=your_app_password_here

# Database
DATABASE_URL=postgresql://user:password@host:5432/dbname
```

### Optional

```env
# Development logging
DEBUG=auth:*
```

---

## Phase 2: Rate Limiting & Cleanup

### Required Variables (in addition to Phase 1)

```env
# Upstash Redis (for rate limiting)
UPSTASH_REDIS_REST_URL=https://your-redis-xxx.upstash.io
UPSTASH_REDIS_REST_TOKEN=xxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Cron Security
CRON_SECRET=your_super_secure_cron_secret_here_min_32_chars

# Manual API Access
API_SECRET_KEY=your_super_secure_api_key_here_min_32_chars
```

### Getting Upstash Credentials

1. Go to https://console.upstash.com
2. Create new Redis database
3. Select "Connect" → "REST API"
4. Copy URL and token
5. Add to environment variables

### Vercel Cron Setup

Add to `vercel.json`:

```json
{
  "crons": [
    {
      "path": "/api/cron/cleanup-tokens",
      "schedule": "0 2 * * *"
    }
  ]
}
```

### Testing Cron Locally

```bash
# Call with correct secret
curl -H "Authorization: Bearer your_cron_secret" \
  http://localhost:3000/api/cron/cleanup-tokens

# Or use manual trigger
curl -X POST http://localhost:3000/api/cron/cleanup-tokens \
  -H "x-api-key: your_api_secret_key"
```

---

## Phase 3: Background Jobs (Inngest)

### Required Variables (in addition to Phase 1 & 2)

```env
# Inngest Event Key
INNGEST_EVENT_KEY=evt_prod_xxxxxxxxxxxxxxxxxxxxx

# Inngest Signing Key (for webhook verification)
INNGEST_SIGNING_KEY=signkey_prod_xxxxxxxxxxxxxxxxxxxxx
```

### Getting Inngest Credentials

1. Sign up at https://app.inngest.com
2. Create new organization
3. Create new API key
4. Copy Event Key and Signing Key
5. Add to environment variables

### Local Development

```bash
# Install Inngest CLI
npm install -g inngest

# Start dev server (in another terminal)
inngest-cli dev

# This creates local tunnel on http://localhost:8288
# Your app connects to this tunnel
```

### Production Deployment

Inngest automatically handles:

- Webhook verification using signing key
- Event routing
- Job scheduling
- Retry logic
- Failure handling

---

## Complete Environment File Template

```env
# ============================================
# APPLICATION
# ============================================
NEXT_PUBLIC_APP_URL=https://your-domain.com
NODE_ENV=production
LOG_LEVEL=info

# ============================================
# DATABASE (PRISMA)
# ============================================
DATABASE_URL=postgresql://user:password@host:5432/dbname

# ============================================
# PHASE 1: EMAIL
# ============================================
SMTP_ACCOUNT=your-email@gmail.com
SMTP_PASSWORD=your_app_password_here

# NextAuth Configuration
NEXTAUTH_URL=https://your-domain.com
NEXTAUTH_SECRET=generated_by_openssl_32_char_random_string

# OAuth Providers (existing)
GITHUB_ID=your_github_oauth_id
GITHUB_SECRET=your_github_oauth_secret
GOOGLE_ID=your_google_oauth_id
GOOGLE_SECRET=your_google_oauth_secret

# ============================================
# PHASE 2: RATE LIMITING & CRON
# ============================================
# Upstash Redis
UPSTASH_REDIS_REST_URL=https://your-redis-xxx.upstash.io
UPSTASH_REDIS_REST_TOKEN=xxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Security
CRON_SECRET=your_super_secure_cron_secret_min_32_chars
API_SECRET_KEY=your_super_secure_api_key_min_32_chars

# ============================================
# PHASE 3: BACKGROUND JOBS (INNGEST)
# ============================================
INNGEST_EVENT_KEY=evt_prod_xxxxxxxxxxxxxxxxxxxxx
INNGEST_SIGNING_KEY=signkey_prod_xxxxxxxxxxxxxxxxxxxxx

# ============================================
# OPTIONAL: MONITORING
# ============================================
SENTRY_DSN=https://key@sentry.io/project
SENTRY_ENV=production

# Datadog
DD_API_KEY=your_datadog_api_key
DD_SITE=datadoghq.com

# ============================================
# OPTIONAL: DEVELOPMENT
# ============================================
DEBUG=auth:*
VERBOSE_LOGGING=true
DISABLE_RATE_LIMITING=false
```

---

## Generating Secure Secrets

### Node.js

```bash
# Generate NEXTAUTH_SECRET (43 chars)
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Generate CRON_SECRET (64 chars)
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Generate API_SECRET_KEY (64 chars)
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### OpenSSL

```bash
# Generate secure random string
openssl rand -hex 32

# Generate 64-char secret
openssl rand -hex 64 | head -c 64
```

### Online Tool (⚠️ Use with caution)

- https://www.random.org/strings/

---

## Vercel Dashboard Setup

### Secrets

1. Go to Project Settings → Environment Variables
2. Add all production variables
3. Mark sensitive ones with 🔒 icon
4. Deploy to apply changes

### Crons

1. Create `vercel.json` in root:

```json
{
  "crons": [
    {
      "path": "/api/cron/cleanup-tokens",
      "schedule": "0 2 * * *"
    }
  ]
}
```

2. Push to main branch
3. Cron appears in Deployments tab

---

## Local Development

### `.env.local` (Git ignored)

```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
DATABASE_URL=postgresql://localhost/clothing_store
SMTP_ACCOUNT=test@gmail.com
SMTP_PASSWORD=test_password

# Optional for local testing
UPSTASH_REDIS_REST_URL=http://localhost:8079  # Local Redis
CRON_SECRET=dev_secret_not_used_locally
```

### Start Services

```bash
# Database
docker run -d --name postgres -e POSTGRES_PASSWORD=postgres postgres

# Redis (for rate limiting)
docker run -d --name redis redis

# Inngest (in new terminal)
inngest-cli dev

# Next.js
npm run dev
```

---

## Validation Checklist

### Phase 1 Setup

- [ ] `NEXT_PUBLIC_APP_URL` set (no trailing slash)
- [ ] `SMTP_ACCOUNT` and `SMTP_PASSWORD` valid
- [ ] `DATABASE_URL` connects successfully
- [ ] Can send test email
- [ ] Database migration applied (`npx prisma migrate dev`)

### Phase 2 Setup

- [ ] `UPSTASH_REDIS_REST_URL` set and reachable
- [ ] `UPSTASH_REDIS_REST_TOKEN` valid
- [ ] `CRON_SECRET` is 32+ characters
- [ ] `API_SECRET_KEY` is 32+ characters
- [ ] `vercel.json` configured (if using Vercel)
- [ ] Rate limiter responds correctly

### Phase 3 Setup

- [ ] `INNGEST_EVENT_KEY` set
- [ ] `INNGEST_SIGNING_KEY` set
- [ ] Inngest CLI running locally (`inngest-cli dev`)
- [ ] `/api/inngest` route is accessible
- [ ] Job functions are registered

---

## Troubleshooting

### "Rate limit service unavailable"

```
→ Check UPSTASH_REDIS_REST_URL and TOKEN
→ Verify Redis database is created in Upstash console
→ Check firewall/IP whitelist settings
```

### "Cron job not running"

```
→ Verify CRON_SECRET is set
→ Check vercel.json syntax
→ Look at Deployments tab → Cron Schedules
→ Test manually: curl -H "Authorization: Bearer SECRET" /api/cron/...
```

### "Email not sending in background"

```
→ Check Inngest credentials
→ Verify job functions are registered in `/api/inngest`
→ Check Inngest dashboard for failed jobs
→ Enable verbose logging: DEBUG=auth:*
```

### "Token generation failing"

```
→ Ensure Node version ≥ 18 (for crypto module)
→ Check crypto.randomBytes is available
→ Verify no security policy blocking crypto
```

---

## Security Best Practices

✅ **DO:**

- Store secrets in environment variables
- Rotate secrets regularly
- Use different secrets per environment
- Enable IP whitelist in Upstash
- Monitor secret access logs
- Use strong passwords for email accounts

❌ **DON'T:**

- Commit secrets to Git
- Share secrets in messages
- Use same secret across environments
- Log secrets anywhere
- Use weak/predictable secrets
- Skip HTTPS enforcement

---

## Monitoring Environment

### Logs to Enable

```env
DEBUG=auth:*
LOG_LEVEL=debug
VERBOSE_LOGGING=true
```

### Health Checks

```bash
# Check email service
npm run check:email

# Check rate limiter
npm run check:ratelimit

# Check inngest
npm run check:inngest

# Full health check
npm run health:check
```

---

**Last Updated:** May 7, 2026  
**Status:** Complete
