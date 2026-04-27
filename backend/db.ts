// Simple in-memory database for MVP
// Replace with PostgreSQL/MongoDB in production

export interface User {
  id: string;
  email: string;
  password: string; // hashed
  name: string;
  createdAt: Date;
  currentStreak: number;
  longestStreak: number;
  totalChallenges: number;
  lastChallengeDate: string | null;
}

export interface ChallengeHistory {
  id: string;
  userId: string;
  challengeTitle: string;
  category: string;
  completedAt: Date;
  durationSeconds: number;
}

class Database {
  private users: Map<string, User> = new Map();
  private history: ChallengeHistory[] = [];
  private emailIndex: Map<string, string> = new Map(); // email -> userId

  // Users
  createUser(user: User): User {
    this.users.set(user.id, user);
    this.emailIndex.set(user.email.toLowerCase(), user.id);
    return user;
  }

  getUserById(id: string): User | undefined {
    return this.users.get(id);
  }

  getUserByEmail(email: string): User | undefined {
    const userId = this.emailIndex.get(email.toLowerCase());
    return userId ? this.users.get(userId) : undefined;
  }

  updateUser(id: string, updates: Partial<User>): User | undefined {
    const user = this.users.get(id);
    if (!user) return undefined;
    const updated = { ...user, ...updates };
    this.users.set(id, updated);
    return updated;
  }

  // Challenge History
  addChallengeHistory(entry: ChallengeHistory): ChallengeHistory {
    this.history.push(entry);
    return entry;
  }

  getUserHistory(userId: string, limit = 50): ChallengeHistory[] {
    return this.history
      .filter(h => h.userId === userId)
      .sort((a, b) => b.completedAt.getTime() - a.completedAt.getTime())
      .slice(0, limit);
  }

  getUserStats(userId: string) {
    const userHistory = this.history.filter(h => h.userId === userId);
    const categories = new Map<string, number>();
    
    userHistory.forEach(h => {
      categories.set(h.category, (categories.get(h.category) || 0) + 1);
    });

    return {
      totalCompleted: userHistory.length,
      categoriesBreakdown: Object.fromEntries(categories),
      recentChallenges: userHistory.slice(0, 10),
    };
  }
}

export const db = new Database();
