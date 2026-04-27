# Rewire - Replace Mindless Scrolling with Micro-Wins

A habit-breaking app that swaps dopamine-draining feeds for 60-second challenges that actually feel good.

## 🎯 The Problem We're Solving

People waste hours doomscrolling every day, feeling drained and guilty. Rewire intercepts that habit and offers meaningful 60-second micro-challenges instead — helping users reclaim 45+ minutes daily.

## ✨ Features

- **Authentication System**: Email/password signup & login with JWT tokens
- **Streak Tracking**: Daily challenge streaks to build consistency
- **24 Curated Challenges**: Across 8 categories (creative, language, mindfulness, physical, gratitude, trivia, music, coding)
- **Progress Dashboard**: Track total challenges completed and category breakdown
- **Instant Access**: Try challenges without signup, create account to track progress
- **Beautiful UI**: Modern, responsive design with smooth animations

## 🏗️ Tech Stack

### Frontend
- React 19 + TypeScript
- Vite
- Tailwind CSS 4
- Motion (Framer Motion)
- Context API for state management

### Backend
- Node.js + Express
- TypeScript
- JWT authentication
- bcryptjs for password hashing
- In-memory database (replace with PostgreSQL/MongoDB for production)

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd rewire
```

2. **Install dependencies**
```bash
# Install root dependencies
npm install

# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies
cd ../backend
npm install
```

3. **Start the development servers**

Open two terminal windows:

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```
Backend runs on http://localhost:3001

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```
Frontend runs on http://localhost:3000

4. **Open your browser**
Navigate to http://localhost:3000

## 📁 Project Structure

```
rewire/
├── frontend/               # React frontend
│   ├── src/
│   │   ├── components/    # UI components
│   │   │   ├── AuthModal.tsx
│   │   │   ├── ChallengeCard.tsx
│   │   │   └── ChallengeModal.tsx
│   │   ├── contexts/      # React contexts
│   │   │   └── AuthContext.tsx
│   │   ├── hooks/         # Custom hooks
│   │   │   └── useChallenge.ts
│   │   ├── App.tsx        # Main app component
│   │   ├── main.tsx       # Entry point
│   │   └── index.css      # Global styles
│   ├── index.html
│   ├── vite.config.ts
│   └── package.json
│
├── backend/               # Express backend
│   ├── server.ts         # Main server file
│   ├── auth.ts           # Authentication logic
│   ├── db.ts             # In-memory database
│   ├── tsconfig.json
│   └── package.json
│
├── .env                  # Environment variables
└── README.md
```

## 🔐 Authentication Flow

1. User clicks "Get Started"
2. If not logged in → Auth modal opens
3. User signs up or logs in
4. JWT token stored in httpOnly cookie
5. User can now track challenges and streaks
6. Challenges auto-save progress when completed

## 🎮 User Flow

### Without Account (Guest)
1. Land on homepage
2. Click "Get Started" → Auth modal
3. Can try challenges without signup
4. Progress not saved

### With Account
1. Sign up / Log in
2. Click "Get Started" → Challenge modal opens
3. Complete 60-second challenge
4. Progress tracked automatically
5. Streak increments daily
6. View stats in nav bar

## 🔧 API Endpoints

### Auth
- `POST /api/auth/signup` - Create new account
- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout
- `GET /api/auth/me` - Get current user

### Challenges
- `GET /api/challenge` - Get random challenge
- `GET /api/challenges` - Get 6 challenges
- `POST /api/challenge/complete` - Mark challenge complete (auth required)
- `GET /api/history` - Get user's challenge history (auth required)
- `GET /api/stats` - Get user stats (auth required)

## 🎨 Design System

### Colors
- Brand Accent: `#FF5C35` (Orange)
- Brand Text: `#1A1A1A` (Dark)
- Brand Muted: `#666666` (Gray)
- Brand BG: `#FDFCFB` (Off-white)
- Brand Border: `#E5E5E5` (Light gray)

### Typography
- Headings: Instrument Serif
- Body: Inter

## 🚧 Roadmap

### MVP (Current)
- [x] Authentication system
- [x] Challenge library
- [x] Streak tracking
- [x] Basic stats

### Next Steps
- [ ] Database integration (PostgreSQL/MongoDB)
- [ ] User profile page
- [ ] Challenge history view
- [ ] Social features (share streaks)
- [ ] Mobile app (React Native)
- [ ] Browser extension for scroll detection
- [ ] Custom challenge creation
- [ ] Category preferences
- [ ] Notifications/reminders

## 🤝 Contributing

This is an MVP. Contributions welcome!

## 📄 License

MIT

## 🙏 Acknowledgments

Built to help people reclaim their attention and build better habits, one 60-second challenge at a time.
