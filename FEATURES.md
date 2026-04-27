# Rewire - Feature Documentation

## 🎯 Overview
Rewire is a production-ready MVP habit-breaking app that replaces mindless scrolling with 60-second micro-challenges. Built with React 19, TypeScript, Express, and JWT authentication.

---

## ✅ Completed Features

### 1. Authentication System
- **JWT-based authentication** with httpOnly cookies
- **bcrypt password hashing** (10 rounds)
- **Email/password signup & login**
- **Protected routes** with middleware
- **Session persistence** (7-day token expiry)
- **Auto-refresh user data** after actions

**Files:**
- `backend/auth.ts` - JWT, bcrypt, middleware
- `backend/server.ts` - Auth routes (/signup, /login, /logout, /me)
- `frontend/src/contexts/AuthContext.tsx` - Auth state management
- `frontend/src/components/AuthModal.tsx` - Login/signup UI

---

### 2. Challenge System
- **Static library of 24 curated challenges** across 8 categories:
  - Creative sketching
  - Language learning
  - Mindfulness
  - Physical movement
  - Gratitude reflection
  - Trivia
  - Music
  - Coding puzzles

- **Challenge completion tracking**
- **Streak calculation** (daily, resets if day missed)
- **Challenge history** with timestamps
- **Category-based filtering**

**API Endpoints:**
- `GET /api/challenge` - Random single challenge
- `GET /api/challenges` - 6 random challenges (dashboard)
- `GET /api/challenges/all` - All 24 challenges (browse page)
- `POST /api/challenge/complete` - Mark challenge complete
- `GET /api/history` - User's challenge history
- `GET /api/stats` - User statistics

**Files:**
- `backend/server.ts` - Challenge routes & library
- `frontend/src/hooks/useChallenge.ts` - Challenge fetching hook
- `frontend/src/components/ChallengeCard.tsx` - Challenge UI

---

### 3. Dashboard Page (Main Hub)
**Features:**
- **Hero streak card** with gradient, progress bar, milestone tracking
- **Quick stats cards**: Total challenges, longest streak
- **Today's challenge** with 60-second timer
- **Daily goal tracker** (3 challenges/day)
- **Weekly progress tracker** (real data from API)
- **28-day activity calendar** (shows actual completion dates)
- **Achievement badges** (Week Warrior, Getting Started)
- **Confetti animation** on challenge completion
- **Responsive design** (mobile, tablet, desktop)

**Real Data Integration:**
- Fetches `/api/history` on mount
- Calculates today's completions from history
- Calculates weekly completions (last 7 days)
- Builds activity calendar from actual dates
- Refreshes after each challenge completion

**Files:**
- `frontend/src/pages/DashboardPage.tsx`

---

### 4. Challenges Page (Browse All)
**Features:**
- **Grid view** of all 24 challenges
- **Search functionality** (title + description)
- **Category filter dropdown** (9 options including "All")
- **Challenge cards** with category badge, duration, description
- **"Try This Challenge" button** on each card
- **Empty state** when no results
- **Loading state** with spinner

**Files:**
- `frontend/src/pages/ChallengesPage.tsx`

---

### 5. Progress Page (Analytics)
**Features:**
- **4 stat cards**: Current streak, total completed, personal best, time invested
- **Category breakdown chart** with color-coded progress bars
- **Challenge history timeline** with:
  - Challenge title
  - Category badge (color-coded)
  - Completion date & time
  - Duration
- **Empty state** for new users
- **Real-time data** from `/api/history` and `/api/stats`

**Files:**
- `frontend/src/pages/ProgressPage.tsx`

---

### 6. Settings Page
**Features:**
- **Tabbed interface** (Profile & Security, Preferences)
- **Profile editing**: Name, email
- **Password change**: Current, new, confirm validation
- **Daily goal slider** (1-10 challenges)
- **Notification toggle** (daily reminders)
- **Save status feedback** (saving, success, error)
- **Error messages** for validation failures

**Note:** API endpoints for profile/password updates not yet implemented (simulated with setTimeout)

**Files:**
- `frontend/src/pages/SettingsPage.tsx`

---

### 7. Navigation & Routing
**Features:**
- **Persistent left sidebar** (Duolingo-style)
- **Mobile-responsive menu** with hamburger icon
- **Active route highlighting**
- **Protected routes** (redirect to /login if not authenticated)
- **Conditional navbar** (only on landing/login, not dashboard)
- **Smooth transitions** with Framer Motion

**Routes:**
- `/` - Landing page
- `/login` - Login/signup page
- `/dashboard` - Main dashboard (protected)
- `/challenges` - Browse challenges (protected)
- `/progress` - Analytics (protected)
- `/settings` - User settings (protected)

**Files:**
- `frontend/src/App.tsx` - Routing setup
- `frontend/src/components/Sidebar.tsx` - Navigation
- `frontend/src/components/Navbar.tsx` - Landing page nav

---

### 8. Database (In-Memory)
**Models:**
- **User**: id, email, password, name, createdAt, currentStreak, longestStreak, totalChallenges, lastChallengeDate
- **ChallengeHistory**: id, userId, challengeTitle, category, completedAt, durationSeconds

**Methods:**
- `createUser()`, `getUserById()`, `getUserByEmail()`, `updateUser()`
- `addChallengeHistory()`, `getUserHistory()`, `getUserStats()`

**Files:**
- `backend/db.ts`

---

### 9. Error Handling
**Features:**
- **React ErrorBoundary** component
- **Graceful error UI** with refresh button
- **Development mode** error details
- **API error handling** in all fetch calls
- **Loading states** on all pages
- **Empty states** for no data

**Files:**
- `frontend/src/components/ErrorBoundary.tsx`
- `frontend/src/main.tsx` - ErrorBoundary wrapper

---

### 10. Responsive Design
**Breakpoints:**
- **Mobile**: < 768px (single column, hamburger menu)
- **Tablet**: 768px - 1024px (2 columns)
- **Desktop**: > 1024px (3 columns, full sidebar)

**Mobile Optimizations:**
- Collapsible sidebar with overlay
- Stacked stat cards (2x2 grid)
- Smaller text sizes
- Touch-friendly buttons
- Reduced padding/margins

---

## 🚀 Tech Stack

### Frontend
- **React 19** with TypeScript
- **Vite** (build tool)
- **React Router** (routing)
- **Framer Motion** (animations)
- **Lucide React** (icons)
- **Tailwind CSS** (styling)

### Backend
- **Express** with TypeScript
- **JWT** (authentication)
- **bcrypt** (password hashing)
- **cookie-parser** (cookie handling)
- **CORS** (cross-origin requests)

### Development
- **tsx** (TypeScript execution)
- **Vite proxy** (API forwarding)
- **In-memory database** (MVP, replace with PostgreSQL/MongoDB later)

---

## 📁 Project Structure

```
rewire/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── AuthModal.tsx
│   │   │   ├── ChallengeCard.tsx
│   │   │   ├── ChallengeModal.tsx
│   │   │   ├── ErrorBoundary.tsx
│   │   │   ├── Navbar.tsx
│   │   │   └── Sidebar.tsx
│   │   ├── contexts/
│   │   │   └── AuthContext.tsx
│   │   ├── hooks/
│   │   │   └── useChallenge.ts
│   │   ├── pages/
│   │   │   ├── DashboardPage.tsx
│   │   │   ├── LandingPage.tsx
│   │   │   ├── LoginPage.tsx
│   │   │   ├── ChallengesPage.tsx
│   │   │   ├── ProgressPage.tsx
│   │   │   └── SettingsPage.tsx
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css
│   ├── package.json
│   └── vite.config.ts
├── backend/
│   ├── server.ts
│   ├── auth.ts
│   ├── db.ts
│   ├── package.json
│   └── tsconfig.json
├── package.json (root)
└── README.md
```

---

## 🔧 Running the App

### Development Mode

1. **Install dependencies:**
```bash
npm install
```

2. **Start backend:**
```bash
cd backend
npm run dev
```
Backend runs on `http://localhost:3001`

3. **Start frontend (new terminal):**
```bash
cd frontend
npm run dev
```
Frontend runs on `http://localhost:3000`

### Production Build

```bash
# Build frontend
cd frontend
npm run build

# Build backend
cd backend
npm run build

# Start production server
cd backend
npm start
```

---

## 🎨 Design Patterns Used

1. **Duolingo-inspired gamification**
   - Streak tracking with fire emoji
   - Progress bars and milestones
   - Achievement badges
   - Confetti celebrations

2. **Google Material Design principles**
   - Persistent left sidebar navigation
   - Card-based layouts
   - Elevation with shadows
   - Consistent spacing (8px grid)

3. **Strava-style activity calendar**
   - 28-day grid view
   - Color-coded completion dates
   - Hover tooltips with dates

---

## 🐛 Known Limitations (MVP)

1. **In-memory database** - Data lost on server restart
2. **No password reset** - Email verification not implemented
3. **Settings API** - Profile/password update endpoints not connected
4. **No notifications** - Daily reminder system not built
5. **No social features** - No friends, leaderboards, sharing
6. **No challenge customization** - Can't create custom challenges
7. **No data export** - Can't download challenge history
8. **No dark mode** - Only light theme available

---

## 🚀 Next Steps for Production

### High Priority
1. **Replace in-memory DB** with PostgreSQL/MongoDB
2. **Add email verification** for signup
3. **Implement password reset** flow
4. **Connect settings API** endpoints
5. **Add data persistence** tests
6. **Deploy to cloud** (Vercel/Railway/Render)

### Medium Priority
7. **Add daily notifications** (push/email)
8. **Implement challenge categories** preferences
9. **Add data export** (CSV/JSON)
10. **Build admin panel** for challenge management
11. **Add analytics** (Mixpanel/PostHog)
12. **Implement rate limiting** on API

### Low Priority
13. **Add dark mode** toggle
14. **Build social features** (friends, sharing)
15. **Add challenge creation** for users
16. **Implement leaderboards**
17. **Add achievements system** (more badges)
18. **Build mobile app** (React Native)

---

## 📊 API Reference

### Authentication
- `POST /api/auth/signup` - Create account
- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout
- `GET /api/auth/me` - Get current user (protected)

### Challenges
- `GET /api/challenge` - Random challenge
- `GET /api/challenges` - 6 random challenges
- `GET /api/challenges/all` - All challenges
- `POST /api/challenge/complete` - Complete challenge (protected)

### User Data
- `GET /api/history` - Challenge history (protected)
- `GET /api/stats` - User statistics (protected)

### Health
- `GET /api/health` - Server health check

---

## 🎯 Success Metrics

**User Engagement:**
- Daily active users (DAU)
- Average challenges completed per user
- Streak retention rate (7-day, 30-day)
- Session duration

**Product Metrics:**
- Signup conversion rate
- Challenge completion rate
- Category preferences
- Time of day usage patterns

**Technical Metrics:**
- API response time (< 200ms)
- Error rate (< 1%)
- Uptime (> 99.9%)
- Page load time (< 2s)

---

## 📝 License
MIT License - See LICENSE file for details

---

## 👥 Contributors
Built with ❤️ by the Rewire team
