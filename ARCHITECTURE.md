# 🏗️ Rewire Architecture

## Overview

Rewire is a full-stack TypeScript application with a React frontend and Express backend, designed to help users break scrolling habits with 60-second micro-challenges.

## System Architecture

```
┌─────────────────────────────────────────────────────────┐
│                     Frontend (React)                     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │   Auth       │  │  Challenge   │  │   UI         │  │
│  │   Context    │  │   Hooks      │  │   Components │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
│         │                  │                  │          │
│         └──────────────────┴──────────────────┘          │
│                           │                               │
│                    Fetch API (CORS)                       │
└───────────────────────────┼───────────────────────────────┘
                            │
                    ┌───────▼────────┐
                    │  Vite Proxy    │
                    │  /api → :3001  │
                    └───────┬────────┘
                            │
┌───────────────────────────▼───────────────────────────────┐
│                   Backend (Express)                        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐   │
│  │   Auth       │  │  Challenge   │  │   Database   │   │
│  │   Middleware │  │   Routes     │  │   (Memory)   │   │
│  └──────────────┘  └──────────────┘  └──────────────┘   │
│         │                  │                  │           │
│         └──────────────────┴──────────────────┘           │
└───────────────────────────────────────────────────────────┘
```

## Frontend Architecture

### Component Hierarchy

```
App.tsx
├── AuthProvider (Context)
│   └── AuthContext
├── Nav
│   ├── User Info (if logged in)
│   └── Auth Buttons
├── ChallengeModal
│   └── ChallengeCard
├── AuthModal
│   ├── Login Form
│   └── Signup Form
└── Landing Page Sections
    ├── Hero
    ├── Features
    ├── Pricing
    └── FAQ
```

### State Management

**Global State (Context API):**
- `AuthContext`: User authentication state, login/signup/logout functions

**Local State (useState):**
- Modal visibility
- Challenge data
- Form inputs
- UI interactions

### Data Flow

1. **Authentication Flow:**
```
User Action → AuthModal → AuthContext.login/signup
→ POST /api/auth/login → JWT Cookie Set
→ AuthContext.user updated → UI re-renders
```

2. **Challenge Completion Flow:**
```
User completes challenge → ChallengeCard.handleComplete
→ POST /api/challenge/complete (if logged in)
→ Backend updates user stats → refreshUser()
→ Nav shows updated streak
```

## Backend Architecture

### Layers

```
Routes (server.ts)
    ↓
Middleware (auth.ts)
    ↓
Business Logic (server.ts)
    ↓
Data Layer (db.ts)
```

### Authentication System

**JWT Flow:**
1. User signs up/logs in
2. Password hashed with bcrypt (10 rounds)
3. JWT token generated with userId payload
4. Token stored in httpOnly cookie (7 day expiry)
5. Subsequent requests include cookie
6. `requireAuth` middleware validates token
7. User object attached to request

**Security Features:**
- Passwords hashed with bcrypt
- JWT tokens with expiration
- httpOnly cookies (XSS protection)
- CORS configured for specific origin
- Password minimum length (6 chars)

### Database Schema (In-Memory)

**User:**
```typescript
{
  id: string (UUID)
  email: string (unique, lowercase)
  password: string (hashed)
  name: string
  createdAt: Date
  currentStreak: number
  longestStreak: number
  totalChallenges: number
  lastChallengeDate: string | null (YYYY-MM-DD)
}
```

**ChallengeHistory:**
```typescript
{
  id: string (UUID)
  userId: string
  challengeTitle: string
  category: string
  completedAt: Date
  durationSeconds: number
}
```

**Indexes:**
- Email → UserId (Map for O(1) lookup)

### Streak Calculation Logic

```typescript
function calculateStreak(lastChallengeDate: string | null) {
  const today = new Date()
  const last = new Date(lastChallengeDate)
  const diffDays = daysBetween(today, last)

  if (diffDays === 0) return { current: 0, shouldReset: false } // Same day
  if (diffDays === 1) return { current: 1, shouldReset: false } // Next day
  return { current: 1, shouldReset: true } // Missed day(s)
}
```

## API Design

### RESTful Endpoints

**Authentication:**
- `POST /api/auth/signup` - Create account
- `POST /api/auth/login` - Authenticate
- `POST /api/auth/logout` - Clear session
- `GET /api/auth/me` - Get current user (protected)

**Challenges:**
- `GET /api/challenge` - Random challenge
- `GET /api/challenges` - Batch of 6 challenges
- `POST /api/challenge/complete` - Mark complete (protected)
- `GET /api/history` - User history (protected)
- `GET /api/stats` - User stats (protected)

### Response Format

**Success:**
```json
{
  "success": true,
  "data": { ... }
}
```

**Error:**
```json
{
  "error": "Error message"
}
```

## Security Considerations

### Current Implementation
✅ Password hashing (bcrypt)
✅ JWT authentication
✅ httpOnly cookies
✅ CORS configuration
✅ Input validation

### Production Recommendations
⚠️ Use environment variables for JWT_SECRET
⚠️ Add rate limiting
⚠️ Add HTTPS in production
⚠️ Add CSRF protection
⚠️ Add email verification
⚠️ Add password reset flow
⚠️ Add refresh tokens
⚠️ Add account lockout after failed attempts

## Performance Considerations

### Current
- In-memory database (fast, but not persistent)
- No caching layer
- No CDN for static assets
- No image optimization

### Production Recommendations
- PostgreSQL/MongoDB for persistence
- Redis for session storage
- CDN for static assets (Cloudflare, Vercel)
- Image optimization (next/image, cloudinary)
- API response caching
- Database indexing
- Connection pooling

## Scalability Path

### Phase 1: MVP (Current)
- In-memory database
- Single server
- ~100 concurrent users

### Phase 2: Production
- PostgreSQL database
- Redis for sessions
- Load balancer
- ~10k concurrent users

### Phase 3: Scale
- Database replication
- Microservices (auth, challenges, analytics)
- Message queue (RabbitMQ/Kafka)
- ~100k+ concurrent users

## Testing Strategy (Future)

### Unit Tests
- Auth functions (hash, verify, token generation)
- Streak calculation logic
- Challenge selection logic

### Integration Tests
- API endpoints
- Auth flow
- Challenge completion flow

### E2E Tests
- User signup → challenge completion → streak tracking
- Login → logout flow
- Challenge refresh flow

## Deployment

### Development
```bash
npm run dev:backend  # Port 3001
npm run dev:frontend # Port 3000
```

### Production Build
```bash
cd frontend && npm run build
# Serve dist/ with nginx or Vercel
# Deploy backend to Railway, Render, or AWS
```

### Environment Variables

**Backend:**
- `JWT_SECRET` - Secret for JWT signing
- `PORT` - Server port (default 3001)
- `NODE_ENV` - Environment (development/production)

**Frontend:**
- Vite automatically proxies `/api` to backend in dev
- In production, set API_URL or use same domain

## Monitoring & Observability (Future)

- Error tracking (Sentry)
- Analytics (PostHog, Mixpanel)
- Logging (Winston, Pino)
- APM (New Relic, DataDog)
- Uptime monitoring (UptimeRobot)

## Future Enhancements

### Technical
- [ ] WebSocket for real-time features
- [ ] Push notifications (PWA)
- [ ] Offline support (Service Worker)
- [ ] GraphQL API
- [ ] Mobile app (React Native)

### Features
- [ ] Social features (friends, leaderboards)
- [ ] Custom challenges
- [ ] Challenge categories preferences
- [ ] Achievements/badges
- [ ] Analytics dashboard
- [ ] Browser extension for scroll detection
