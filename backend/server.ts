import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { randomUUID } from "crypto";
import { db, User, ChallengeHistory } from "./db.js";
import { hashPassword, verifyPassword, generateToken, requireAuth, calculateStreak, AuthRequest } from "./auth.js";

const app = express();

// Middleware
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(express.json());
app.use(cookieParser());

// Static challenge library
const CHALLENGE_LIBRARY = [
  { title: "Sketch your morning coffee", description: "A quick creative burst to reset your focus. No perfection required.", category: "creative sketching", durationSeconds: 60 },
  { title: "Doodle your current mood", description: "Express how you're feeling right now through simple shapes and lines.", category: "creative sketching", durationSeconds: 60 },
  { title: "Draw 5 circles, make them interesting", description: "Transform basic circles into something unique. Let your creativity flow.", category: "creative sketching", durationSeconds: 60 },
  { title: "Learn 3 words in Spanish", description: "Expand your vocabulary: 'Hola' (Hello), 'Gracias' (Thanks), 'Adiós' (Goodbye).", category: "language learning", durationSeconds: 60 },
  { title: "Practice French pronunciation", description: "Say these out loud: 'Bonjour', 'Merci', 'Au revoir'. Feel the accent!", category: "language learning", durationSeconds: 60 },
  { title: "Count to 10 in Japanese", description: "Ichi, ni, san, shi, go, roku, shichi, hachi, kyuu, juu. You got this!", category: "language learning", durationSeconds: 60 },
  { title: "Box breathing: 4-4-4-4", description: "Breathe in for 4, hold for 4, out for 4, hold for 4. Repeat 3 times.", category: "mindfulness", durationSeconds: 60 },
  { title: "Name 5 things you can see", description: "Ground yourself in the present moment. Look around and really notice.", category: "mindfulness", durationSeconds: 60 },
  { title: "Body scan: head to toes", description: "Close your eyes. Notice tension in your body from head to toes. Release it.", category: "mindfulness", durationSeconds: 60 },
  { title: "20 jumping jacks", description: "Get your blood flowing. Quick burst of energy to reset your focus.", category: "physical movement", durationSeconds: 60 },
  { title: "Stretch your neck and shoulders", description: "Roll your shoulders back 5 times. Tilt your head side to side gently.", category: "physical movement", durationSeconds: 60 },
  { title: "Wall push-ups: 15 reps", description: "Stand arm's length from a wall. Lean in, push back. Feel the strength.", category: "physical movement", durationSeconds: 60 },
  { title: "List 3 things you're grateful for", description: "Big or small. A person, a moment, a feeling. Write them down or say them out loud.", category: "gratitude reflection", durationSeconds: 60 },
  { title: "Text someone 'thank you'", description: "Think of someone who helped you recently. Send them a quick message of appreciation.", category: "gratitude reflection", durationSeconds: 60 },
  { title: "Appreciate something ordinary", description: "Your coffee mug, your chair, the sunlight. Find beauty in the mundane.", category: "gratitude reflection", durationSeconds: 60 },
  { title: "Quick geography quiz", description: "What's the capital of Australia? (It's Canberra, not Sydney!)", category: "trivia", durationSeconds: 60 },
  { title: "Science fact of the day", description: "Honey never spoils. Archaeologists found 3,000-year-old honey in Egyptian tombs, still edible!", category: "trivia", durationSeconds: 60 },
  { title: "History in 60 seconds", description: "The Great Wall of China is over 13,000 miles long. That's halfway around Earth!", category: "trivia", durationSeconds: 60 },
  { title: "Hum your favorite song", description: "Pick a song that makes you happy. Hum it out loud. Feel the joy.", category: "music", durationSeconds: 60 },
  { title: "Tap out a rhythm", description: "Use your desk, your lap, anything. Create a simple beat and repeat it.", category: "music", durationSeconds: 60 },
  { title: "Listen to 60 seconds of classical", description: "Close your eyes. Let the music wash over you. Notice how it makes you feel.", category: "music", durationSeconds: 60 },
  { title: "FizzBuzz in your head: 1-15", description: "Count 1-15. Say 'Fizz' for multiples of 3, 'Buzz' for 5, 'FizzBuzz' for both.", category: "coding puzzle", durationSeconds: 60 },
  { title: "Reverse a word mentally", description: "Pick any word. Spell it backwards in your head. Try 'REWIRE' → 'ERIWER'.", category: "coding puzzle", durationSeconds: 60 },
  { title: "Binary counting: 1-10", description: "Count in binary: 1, 10, 11, 100, 101, 110, 111, 1000, 1001, 1010. Nerd out!", category: "coding puzzle", durationSeconds: 60 },
];

// ============ AUTH ROUTES ============

// POST /api/auth/signup
app.post("/api/auth/signup", async (req, res) => {
  const { email, password, name } = req.body;

  if (!email || !password || !name) {
    return res.status(400).json({ error: "Email, password, and name are required" });
  }

  if (password.length < 6) {
    return res.status(400).json({ error: "Password must be at least 6 characters" });
  }

  const existing = db.getUserByEmail(email);
  if (existing) {
    return res.status(400).json({ error: "Email already registered" });
  }

  const hashedPassword = await hashPassword(password);
  const user: User = {
    id: randomUUID(),
    email: email.toLowerCase(),
    password: hashedPassword,
    name,
    createdAt: new Date(),
    currentStreak: 0,
    longestStreak: 0,
    totalChallenges: 0,
    lastChallengeDate: null,
  };

  db.createUser(user);
  const token = generateToken(user.id);

  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  res.json({
    success: true,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      currentStreak: user.currentStreak,
      longestStreak: user.longestStreak,
      totalChallenges: user.totalChallenges,
    },
    token,
  });
});

// POST /api/auth/login
app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  const user = db.getUserByEmail(email);
  if (!user) {
    return res.status(401).json({ error: "Invalid email or password" });
  }

  const valid = await verifyPassword(password, user.password);
  if (!valid) {
    return res.status(401).json({ error: "Invalid email or password" });
  }

  const token = generateToken(user.id);

  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.json({
    success: true,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      currentStreak: user.currentStreak,
      longestStreak: user.longestStreak,
      totalChallenges: user.totalChallenges,
    },
    token,
  });
});

// POST /api/auth/logout
app.post("/api/auth/logout", (req, res) => {
  res.clearCookie("token");
  res.json({ success: true });
});

// GET /api/auth/me
app.get("/api/auth/me", requireAuth, (req: AuthRequest, res) => {
  const user = req.user!;
  res.json({
    success: true,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      currentStreak: user.currentStreak,
      longestStreak: user.longestStreak,
      totalChallenges: user.totalChallenges,
      lastChallengeDate: user.lastChallengeDate,
    },
  });
});

// ============ CHALLENGE ROUTES ============

// GET /api/challenge - returns a single random challenge
app.get("/api/challenge", (req, res) => {
  const category = req.query.category as string;
  let pool = CHALLENGE_LIBRARY;
  if (category) {
    pool = CHALLENGE_LIBRARY.filter(c => c.category === category);
  }
  const challenge = pool[Math.floor(Math.random() * pool.length)];
  res.json({ success: true, challenge });
});

// GET /api/challenges - returns 6 random challenges
app.get("/api/challenges", (req, res) => {
  const categories = [...new Set(CHALLENGE_LIBRARY.map(c => c.category))];
  const challenges = categories.slice(0, 6).map(cat => {
    const pool = CHALLENGE_LIBRARY.filter(c => c.category === cat);
    return pool[Math.floor(Math.random() * pool.length)];
  });
  res.json({ success: true, challenges });
});

// POST /api/challenge/complete - mark challenge as complete (requires auth)
app.post("/api/challenge/complete", requireAuth, (req: AuthRequest, res) => {
  const user = req.user!;
  const { challengeTitle, category, durationSeconds } = req.body;

  if (!challengeTitle || !category) {
    return res.status(400).json({ error: "Challenge title and category required" });
  }

  // Add to history
  const entry: ChallengeHistory = {
    id: randomUUID(),
    userId: user.id,
    challengeTitle,
    category,
    completedAt: new Date(),
    durationSeconds: durationSeconds || 60,
  };
  db.addChallengeHistory(entry);

  // Update user stats
  const today = new Date().toISOString().split("T")[0];
  const streakCalc = calculateStreak(user.lastChallengeDate);

  let newStreak = user.currentStreak;
  if (streakCalc.shouldReset) {
    newStreak = 1;
  } else if (streakCalc.current === 1) {
    newStreak = user.currentStreak + 1;
  } else {
    newStreak = user.currentStreak; // same day
  }

  const updated = db.updateUser(user.id, {
    totalChallenges: user.totalChallenges + 1,
    currentStreak: newStreak,
    longestStreak: Math.max(user.longestStreak, newStreak),
    lastChallengeDate: today,
  });

  res.json({
    success: true,
    user: {
      currentStreak: updated!.currentStreak,
      longestStreak: updated!.longestStreak,
      totalChallenges: updated!.totalChallenges,
    },
  });
});

// GET /api/history - get user's challenge history
app.get("/api/history", requireAuth, (req: AuthRequest, res) => {
  const user = req.user!;
  const history = db.getUserHistory(user.id);
  res.json({ success: true, history });
});

// GET /api/stats - get user stats
app.get("/api/stats", requireAuth, (req: AuthRequest, res) => {
  const user = req.user!;
  const stats = db.getUserStats(user.id);
  res.json({ success: true, stats });
});

// Health check
app.get("/api/health", (req, res) => res.json({ status: "ok" }));

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`✨ Rewire API running on http://localhost:${PORT}`));
