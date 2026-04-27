# 🔗 Rewire Integration Diagram

## Complete System Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                              USER BROWSER                                │
│                         http://localhost:3000                            │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    │ HTTP Requests
                                    │ Cookies (httpOnly)
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                           VITE DEV SERVER                                │
│                         (Frontend - Port 3000)                           │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ┌────────────────────────────────────────────────────────────────┐    │
│  │                        REACT APP                                │    │
│  │                                                                 │    │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐        │    │
│  │  │   PAGES      │  │  COMPONENTS  │  │   CONTEXTS   │        │    │
│  │  ├──────────────┤  ├──────────────┤  ├──────────────┤        │    │
│  │  │ Landing      │  │ Navbar       │  │ AuthContext  │        │    │
│  │  │ Login        │  │ Sidebar      │  │              │        │    │
│  │  │ Dashboard    │  │ AuthModal    │  │ - user       │        │    │
│  │  │ Challenges   │  │ ChallengeCard│  │ - login()    │        │    │
│  │  │ Progress     │  │ ErrorBoundary│  │ - signup()   │        │    │
│  │  │ Settings     │  │              │  │ - logout()   │        │    │
│  │  └──────────────┘  └──────────────┘  │ - refresh()  │        │    │
│  │                                       └──────────────┘        │    │
│  │                                                                 │    │
│  │  ┌──────────────┐  ┌──────────────┐                          │    │
│  │  │    HOOKS     │  │    ROUTER    │                          │    │
│  │  ├──────────────┤  ├──────────────┤                          │    │
│  │  │ useChallenge │  │ BrowserRouter│                          │    │
│  │  │ useAuth      │  │ Routes       │                          │    │
│  │  │              │  │ Protected    │                          │    │
│  │  └──────────────┘  └──────────────┘                          │    │
│  └────────────────────────────────────────────────────────────────┘    │
│                                                                          │
│  Vite Proxy Configuration:                                              │
│  /api/* → http://localhost:3001                                         │
│  credentials: include (sends cookies)                                   │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    │ Proxied API Requests
                                    │ /api/auth/*, /api/challenge/*, etc.
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                         EXPRESS SERVER                                   │
│                        (Backend - Port 3001)                             │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ┌────────────────────────────────────────────────────────────────┐    │
│  │                        MIDDLEWARE                               │    │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐        │    │
│  │  │ CORS         │  │ express.json │  │ cookieParser │        │    │
│  │  │              │  │              │  │              │        │    │
│  │  │ origin:      │  │ Parse JSON   │  │ Parse        │        │    │
│  │  │ localhost:   │  │ request      │  │ cookies      │        │    │
│  │  │ 3000         │  │ bodies       │  │              │        │    │
│  │  │              │  │              │  │              │        │    │
│  │  │ credentials: │  │              │  │              │        │    │
│  │  │ true         │  │              │  │              │        │    │
│  │  └──────────────┘  └──────────────┘  └──────────────┘        │    │
│  └────────────────────────────────────────────────────────────────┘    │
│                                                                          │
│  ┌────────────────────────────────────────────────────────────────┐    │
│  │                      API ROUTES                                 │    │
│  │                                                                 │    │
│  │  ┌─────────────────────────────────────────────────────────┐  │    │
│  │  │ AUTH ROUTES                                              │  │    │
│  │  │ POST   /api/auth/signup    → hashPassword → createUser  │  │    │
│  │  │ POST   /api/auth/login     → verifyPassword → genToken  │  │    │
│  │  │ POST   /api/auth/logout    → clearCookie                │  │    │
│  │  │ GET    /api/auth/me        → requireAuth → getUser      │  │    │
│  │  └─────────────────────────────────────────────────────────┘  │    │
│  │                                                                 │    │
│  │  ┌─────────────────────────────────────────────────────────┐  │    │
│  │  │ CHALLENGE ROUTES                                         │  │    │
│  │  │ GET    /api/challenge      → random from library         │  │    │
│  │  │ GET    /api/challenges     → 6 random challenges         │  │    │
│  │  │ GET    /api/challenges/all → all 24 challenges           │  │    │
│  │  │ POST   /api/challenge/     → requireAuth → addHistory    │  │    │
│  │  │        complete            → updateUser → calcStreak     │  │    │
│  │  └─────────────────────────────────────────────────────────┘  │    │
│  │                                                                 │    │
│  │  ┌─────────────────────────────────────────────────────────┐  │    │
│  │  │ USER DATA ROUTES                                         │  │    │
│  │  │ GET    /api/history        → requireAuth → getUserHistory│  │    │
│  │  │ GET    /api/stats          → requireAuth → getUserStats  │  │    │
│  │  └─────────────────────────────────────────────────────────┘  │    │
│  │                                                                 │    │
│  │  ┌─────────────────────────────────────────────────────────┐  │    │
│  │  │ HEALTH CHECK                                             │  │    │
│  │  │ GET    /api/health         → { status: "ok" }            │  │    │
│  │  └─────────────────────────────────────────────────────────┘  │    │
│  └────────────────────────────────────────────────────────────────┘    │
│                                                                          │
│  ┌────────────────────────────────────────────────────────────────┐    │
│  │                      AUTH MODULE (auth.ts)                      │    │
│  │                                                                 │    │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐        │    │
│  │  │ hashPassword │  │ verifyPassword│  │ generateToken│        │    │
│  │  │              │  │              │  │              │        │    │
│  │  │ bcrypt.hash  │  │ bcrypt.      │  │ jwt.sign     │        │    │
│  │  │ (10 rounds)  │  │ compare      │  │ (7 days)     │        │    │
│  │  └──────────────┘  └──────────────┘  └──────────────┘        │    │
│  │                                                                 │    │
│  │  ┌──────────────┐  ┌──────────────┐                          │    │
│  │  │ verifyToken  │  │ requireAuth  │                          │    │
│  │  │              │  │              │                          │    │
│  │  │ jwt.verify   │  │ Middleware   │                          │    │
│  │  │              │  │ checks token │                          │    │
│  │  └──────────────┘  └──────────────┘                          │    │
│  │                                                                 │    │
│  │  ┌──────────────┐                                              │    │
│  │  │ calcStreak   │                                              │    │
│  │  │              │                                              │    │
│  │  │ Date math    │                                              │    │
│  │  │ Reset logic  │                                              │    │
│  │  └──────────────┘                                              │    │
│  └────────────────────────────────────────────────────────────────┘    │
│                                                                          │
│  ┌────────────────────────────────────────────────────────────────┐    │
│  │                    DATABASE MODULE (db.ts)                      │    │
│  │                                                                 │    │
│  │  ┌──────────────────────────────────────────────────────────┐ │    │
│  │  │ In-Memory Database (MVP)                                  │ │    │
│  │  │                                                            │ │    │
│  │  │  users: Map<string, User>                                 │ │    │
│  │  │  history: ChallengeHistory[]                              │ │    │
│  │  │  emailIndex: Map<string, string>                          │ │    │
│  │  └──────────────────────────────────────────────────────────┘ │    │
│  │                                                                 │    │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐        │    │
│  │  │ createUser   │  │ getUserById  │  │ getUserByEmail│       │    │
│  │  │ updateUser   │  │              │  │              │        │    │
│  │  └──────────────┘  └──────────────┘  └──────────────┘        │    │
│  │                                                                 │    │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐        │    │
│  │  │ addChallenge │  │ getUserHistory│  │ getUserStats │        │    │
│  │  │ History      │  │              │  │              │        │    │
│  │  └──────────────┘  └──────────────┘  └──────────────┘        │    │
│  └────────────────────────────────────────────────────────────────┘    │
│                                                                          │
│  ┌────────────────────────────────────────────────────────────────┐    │
│  │                   CHALLENGE LIBRARY                             │    │
│  │                                                                 │    │
│  │  24 Static Challenges:                                          │    │
│  │  - 3 × Creative sketching                                       │    │
│  │  - 3 × Language learning                                        │    │
│  │  - 3 × Mindfulness                                              │    │
│  │  - 3 × Physical movement                                        │    │
│  │  - 3 × Gratitude reflection                                     │    │
│  │  - 3 × Trivia                                                   │    │
│  │  - 3 × Music                                                    │    │
│  │  - 3 × Coding puzzle                                            │    │
│  └────────────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Data Flow: Complete Challenge

```
┌─────────────────────────────────────────────────────────────────────────┐
│ 1. USER ACTION                                                           │
│    User clicks "Start Challenge" → Timer runs → Completes               │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│ 2. FRONTEND (ChallengeCard.tsx)                                         │
│    handleComplete() called                                               │
│    ├─ onComplete() callback (update UI)                                 │
│    └─ POST /api/challenge/complete                                      │
│       Body: {                                                            │
│         challengeTitle: "Sketch your morning coffee",                   │
│         category: "creative sketching",                                 │
│         durationSeconds: 60                                             │
│       }                                                                  │
│       Cookie: token (auto-sent)                                         │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│ 3. VITE PROXY                                                            │
│    /api/challenge/complete → http://localhost:3001/api/challenge/complete│
│    Forwards request with cookies                                        │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│ 4. BACKEND MIDDLEWARE                                                    │
│    ├─ CORS: Check origin (localhost:3000) ✓                            │
│    ├─ express.json: Parse body ✓                                       │
│    ├─ cookieParser: Extract token from cookie ✓                        │
│    └─ requireAuth: Verify JWT token                                    │
│       ├─ Extract token from cookie                                     │
│       ├─ jwt.verify(token, JWT_SECRET)                                 │
│       ├─ Extract userId from payload                                   │
│       ├─ db.getUserById(userId)                                        │
│       └─ Attach user to req.user ✓                                     │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│ 5. ROUTE HANDLER (server.ts)                                            │
│    POST /api/challenge/complete                                         │
│    ├─ Extract user from req.user                                        │
│    ├─ Extract challengeTitle, category, durationSeconds from body      │
│    └─ Validate required fields ✓                                       │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│ 6. DATABASE OPERATIONS                                                   │
│    ├─ Add to history:                                                   │
│    │  db.addChallengeHistory({                                          │
│    │    id: randomUUID(),                                               │
│    │    userId: user.id,                                                │
│    │    challengeTitle: "Sketch your morning coffee",                  │
│    │    category: "creative sketching",                                │
│    │    completedAt: new Date(),                                       │
│    │    durationSeconds: 60                                            │
│    │  })                                                                │
│    │                                                                    │
│    ├─ Calculate streak:                                                │
│    │  today = "2026-04-27"                                             │
│    │  lastChallengeDate = "2026-04-26"                                 │
│    │  diffDays = 1 (consecutive)                                       │
│    │  calculateStreak() → { current: 1, shouldReset: false }           │
│    │  newStreak = currentStreak + 1 = 2                                │
│    │                                                                    │
│    └─ Update user:                                                     │
│       db.updateUser(user.id, {                                         │
│         totalChallenges: user.totalChallenges + 1,                     │
│         currentStreak: 2,                                              │
│         longestStreak: max(longestStreak, 2),                          │
│         lastChallengeDate: "2026-04-27"                                │
│       })                                                               │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│ 7. BACKEND RESPONSE                                                      │
│    res.json({                                                            │
│      success: true,                                                     │
│      user: {                                                            │
│        currentStreak: 2,                                                │
│        longestStreak: 2,                                                │
│        totalChallenges: 2                                               │
│      }                                                                  │
│    })                                                                   │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│ 8. FRONTEND UPDATES                                                      │
│    ├─ refreshUser() → GET /api/auth/me                                 │
│    │  └─ AuthContext updates user state                                │
│    │                                                                    │
│    ├─ fetchHistory() → GET /api/history                                │
│    │  └─ DashboardPage updates:                                        │
│    │     - completedToday counter                                      │
│    │     - completedThisWeek counter                                   │
│    │     - activityDates set                                           │
│    │                                                                    │
│    └─ UI Updates:                                                      │
│       ├─ Streak card: "2 days" 🔥                                      │
│       ├─ Total challenges: "2"                                         │
│       ├─ Activity calendar: adds today's date                          │
│       ├─ Confetti animation plays                                      │
│       └─ "Completed today" badge shows                                 │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Authentication Flow

```
┌─────────────────────────────────────────────────────────────────────────┐
│ SIGNUP FLOW                                                              │
└─────────────────────────────────────────────────────────────────────────┘

User fills form → AuthModal
                    ↓
POST /api/auth/signup
  Body: { email: "test@test.com", password: "password123", name: "Test" }
                    ↓
Backend validates:
  ├─ Email format ✓
  ├─ Password length >= 6 ✓
  └─ Email not already registered ✓
                    ↓
hashPassword("password123")
  └─ bcrypt.hash(password, 10) → "$2a$10$..."
                    ↓
db.createUser({
  id: randomUUID(),
  email: "test@test.com",
  password: "$2a$10$...",
  name: "Test",
  createdAt: new Date(),
  currentStreak: 0,
  longestStreak: 0,
  totalChallenges: 0,
  lastChallengeDate: null
})
                    ↓
generateToken(user.id)
  └─ jwt.sign({ userId }, JWT_SECRET, { expiresIn: "7d" })
  └─ Returns: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                    ↓
res.cookie("token", token, {
  httpOnly: true,
  secure: false (dev),
  sameSite: "lax",
  maxAge: 7 days
})
                    ↓
res.json({
  success: true,
  user: { id, email, name, currentStreak: 0, ... },
  token: "eyJ..."
})
                    ↓
AuthContext.setUser(data.user)
                    ↓
Navigate to /dashboard

┌─────────────────────────────────────────────────────────────────────────┐
│ LOGIN FLOW                                                               │
└─────────────────────────────────────────────────────────────────────────┘

User enters credentials → AuthModal
                           ↓
POST /api/auth/login
  Body: { email: "test@test.com", password: "password123" }
                           ↓
db.getUserByEmail("test@test.com")
  └─ Returns user or undefined
                           ↓
verifyPassword("password123", user.password)
  └─ bcrypt.compare(password, hash)
  └─ Returns: true or false
                           ↓
If valid:
  ├─ generateToken(user.id)
  ├─ Set cookie
  └─ Return user data
                           ↓
AuthContext.setUser(data.user)
                           ↓
Navigate to /dashboard

┌─────────────────────────────────────────────────────────────────────────┐
│ SESSION PERSISTENCE                                                      │
└─────────────────────────────────────────────────────────────────────────┘

Page load → AuthContext useEffect
              ↓
GET /api/auth/me
  Cookie: token (auto-sent by browser)
              ↓
requireAuth middleware:
  ├─ Extract token from cookie
  ├─ jwt.verify(token, JWT_SECRET)
  ├─ Extract userId from payload
  ├─ db.getUserById(userId)
  └─ Attach user to req.user
              ↓
res.json({
  success: true,
  user: { id, email, name, currentStreak, ... }
})
              ↓
AuthContext.setUser(data.user)
              ↓
User stays logged in

┌─────────────────────────────────────────────────────────────────────────┐
│ LOGOUT FLOW                                                              │
└─────────────────────────────────────────────────────────────────────────┘

User clicks Logout → Sidebar
                      ↓
POST /api/auth/logout
                      ↓
res.clearCookie("token")
                      ↓
res.json({ success: true })
                      ↓
AuthContext.setUser(null)
                      ↓
Navigate to /
```

---

## Database Schema

```
┌─────────────────────────────────────────────────────────────────────────┐
│ USER TABLE (Map<string, User>)                                          │
├─────────────────────────────────────────────────────────────────────────┤
│ id                  string (UUID)         Primary Key                   │
│ email               string                Unique, Indexed               │
│ password            string                Hashed (bcrypt)               │
│ name                string                                              │
│ createdAt           Date                                                │
│ currentStreak       number                Default: 0                    │
│ longestStreak       number                Default: 0                    │
│ totalChallenges     number                Default: 0                    │
│ lastChallengeDate   string | null         Format: "YYYY-MM-DD"          │
└─────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│ CHALLENGE_HISTORY TABLE (Array<ChallengeHistory>)                      │
├─────────────────────────────────────────────────────────────────────────┤
│ id                  string (UUID)         Primary Key                   │
│ userId              string                Foreign Key → User.id         │
│ challengeTitle      string                                              │
│ category            string                                              │
│ completedAt         Date                  Timestamp                     │
│ durationSeconds     number                Default: 60                   │
└─────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│ EMAIL_INDEX (Map<string, string>)                                       │
├─────────────────────────────────────────────────────────────────────────┤
│ email (lowercase)   → userId                                            │
│ For fast email lookups during login/signup                              │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Security Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│ AUTHENTICATION SECURITY                                                  │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  Password Storage:                                                       │
│  ┌────────────────────────────────────────────────────────────────┐    │
│  │ Plain text password → bcrypt.hash(password, 10)                │    │
│  │                    → "$2a$10$..." (60 chars)                   │    │
│  │                    → Stored in DB                              │    │
│  │                                                                 │    │
│  │ 10 rounds = 2^10 = 1024 iterations                             │    │
│  │ Includes automatic salt generation                             │    │
│  │ Timing-safe comparison on login                                │    │
│  └────────────────────────────────────────────────────────────────┘    │
│                                                                          │
│  JWT Tokens:                                                             │
│  ┌────────────────────────────────────────────────────────────────┐    │
│  │ Payload: { userId: "uuid" }                                    │    │
│  │ Secret: JWT_SECRET (env variable)                              │    │
│  │ Expiry: 7 days                                                 │    │
│  │ Algorithm: HS256 (HMAC SHA-256)                                │    │
│  │                                                                 │    │
│  │ Token format:                                                   │    │
│  │ eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.                          │    │
│  │ eyJ1c2VySWQiOiJ1dWlkIn0.                                       │    │
│  │ signature                                                       │    │
│  └────────────────────────────────────────────────────────────────┘    │
│                                                                          │
│  Cookie Security:                                                        │
│  ┌────────────────────────────────────────────────────────────────┐    │
│  │ httpOnly: true     → Cannot be accessed by JavaScript          │    │
│  │ secure: production → HTTPS only in production                  │    │
│  │ sameSite: lax      → CSRF protection                           │    │
│  │ maxAge: 7 days     → Auto-expire after 7 days                  │    │
│  │                                                                 │    │
│  │ XSS Protection: httpOnly prevents script access                │    │
│  │ CSRF Protection: sameSite + origin check                       │    │
│  └────────────────────────────────────────────────────────────────┘    │
│                                                                          │
│  CORS Configuration:                                                     │
│  ┌────────────────────────────────────────────────────────────────┐    │
│  │ origin: "http://localhost:3000"                                │    │
│  │ credentials: true                                              │    │
│  │                                                                 │    │
│  │ Only allows requests from frontend                             │    │
│  │ Enables cookie sending                                         │    │
│  └────────────────────────────────────────────────────────────────┘    │
│                                                                          │
│  Protected Routes:                                                       │
│  ┌────────────────────────────────────────────────────────────────┐    │
│  │ requireAuth middleware:                                         │    │
│  │ 1. Extract token from cookie                                   │    │
│  │ 2. Verify JWT signature                                        │    │
│  │ 3. Check expiration                                            │    │
│  │ 4. Lookup user in DB                                           │    │
│  │ 5. Attach user to request                                      │    │
│  │ 6. Continue to route handler                                   │    │
│  │                                                                 │    │
│  │ If any step fails → 401 Unauthorized                           │    │
│  └────────────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────────┘
```

This comprehensive integration analysis shows that Rewire has **excellent backend-frontend integration** with proper authentication, data flow, and security measures. Ready for production after database swap! 🚀
