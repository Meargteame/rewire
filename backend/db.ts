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

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  rarity: "common" | "rare" | "epic" | "legendary";
  condition: (user: User, history: ChallengeHistory[]) => boolean;
  secret?: boolean;
}

export interface UserAchievement {
  userId: string;
  achievementId: string;
  unlockedAt: Date;
  progress: number;
}

class Database {
  private users: Map<string, User> = new Map();
  private history: ChallengeHistory[] = [];
  private userAchievements: UserAchievement[] = [];
  private emailIndex: Map<string, string> = new Map(); // email -> userId

  // Achievement definitions
  private achievements: Achievement[] = [
    {
      id: "first_steps",
      name: "First Steps",
      description: "Complete your first challenge",
      icon: "star",
      rarity: "common",
      condition: (user, history) => user.totalChallenges >= 1
    },
    {
      id: "week_warrior",
      name: "Week Warrior", 
      description: "Maintain a 7-day streak",
      icon: "flame",
      rarity: "rare",
      condition: (user, history) => user.currentStreak >= 7
    },
    {
      id: "month_master",
      name: "Month Master",
      description: "Achieve a 30-day streak",
      icon: "crown",
      rarity: "epic", 
      condition: (user, history) => user.currentStreak >= 30
    },
    {
      id: "century_club",
      name: "Century Club",
      description: "Complete 100 challenges",
      icon: "trophy",
      rarity: "epic",
      condition: (user, history) => user.totalChallenges >= 100
    },
    {
      id: "early_bird",
      name: "Early Bird",
      description: "Complete 10 challenges before 8 AM",
      icon: "zap",
      rarity: "rare",
      condition: (user, history) => {
        const earlyMorning = history.filter(h => {
          const hour = new Date(h.completedAt).getHours();
          return hour < 8;
        });
        return earlyMorning.length >= 10;
      }
    },
    {
      id: "night_owl",
      name: "Night Owl", 
      description: "Complete 10 challenges after 10 PM",
      icon: "target",
      rarity: "rare",
      condition: (user, history) => {
        const lateNight = history.filter(h => {
          const hour = new Date(h.completedAt).getHours();
          return hour >= 22;
        });
        return lateNight.length >= 10;
      }
    },
    {
      id: "renaissance",
      name: "Renaissance",
      description: "Complete challenges in all 8 categories",
      icon: "award",
      rarity: "epic",
      condition: (user, history) => {
        const categories = new Set(history.map(h => h.category));
        return categories.size >= 8;
      }
    },
    {
      id: "perfectionist",
      name: "Perfectionist",
      description: "Complete 30 days without missing a single day",
      icon: "crown",
      rarity: "legendary",
      condition: (user, history) => user.longestStreak >= 30,
      secret: true
    }
  ];

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

  // Achievement methods
  checkAchievements(userId: string): Achievement[] {
    const user = this.getUserById(userId);
    const userHistory = this.getUserHistory(userId);
    if (!user) return [];

    const unlockedAchievements = this.userAchievements
      .filter(ua => ua.userId === userId)
      .map(ua => ua.achievementId);

    const newlyUnlocked: Achievement[] = [];

    this.achievements.forEach(achievement => {
      if (!unlockedAchievements.includes(achievement.id)) {
        if (achievement.condition(user, userHistory)) {
          // Unlock achievement
          this.userAchievements.push({
            userId,
            achievementId: achievement.id,
            unlockedAt: new Date(),
            progress: 100
          });
          newlyUnlocked.push(achievement);
        }
      }
    });

    return newlyUnlocked;
  }

  getUserAchievements(userId: string) {
    const userAchievements = this.userAchievements.filter(ua => ua.userId === userId);
    const user = this.getUserById(userId);
    const userHistory = this.getUserHistory(userId);
    
    return this.achievements.map(achievement => {
      const userAchievement = userAchievements.find(ua => ua.achievementId === achievement.id);
      
      let progress = 0;
      if (user && userHistory) {
        // Calculate progress for locked achievements
        if (!userAchievement) {
          switch (achievement.id) {
            case "first_steps":
              progress = Math.min(user.totalChallenges * 100, 100);
              break;
            case "week_warrior":
              progress = Math.min((user.currentStreak / 7) * 100, 100);
              break;
            case "month_master":
              progress = Math.min((user.currentStreak / 30) * 100, 100);
              break;
            case "century_club":
              progress = Math.min((user.totalChallenges / 100) * 100, 100);
              break;
            case "early_bird":
              const earlyCount = userHistory.filter(h => new Date(h.completedAt).getHours() < 8).length;
              progress = Math.min((earlyCount / 10) * 100, 100);
              break;
            case "night_owl":
              const lateCount = userHistory.filter(h => new Date(h.completedAt).getHours() >= 22).length;
              progress = Math.min((lateCount / 10) * 100, 100);
              break;
            case "renaissance":
              const categories = new Set(userHistory.map(h => h.category));
              progress = Math.min((categories.size / 8) * 100, 100);
              break;
            case "perfectionist":
              progress = Math.min((user.longestStreak / 30) * 100, 100);
              break;
          }
        }
      }

      return {
        ...achievement,
        unlocked: !!userAchievement,
        unlockedAt: userAchievement?.unlockedAt,
        progress: userAchievement ? 100 : progress
      };
    });
  }
}

export const db = new Database();
