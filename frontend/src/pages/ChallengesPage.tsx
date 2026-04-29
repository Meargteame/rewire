import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Sidebar from "../components/Sidebar";
import { Target, Filter, Search, Clock, Sparkles } from "lucide-react";

interface Challenge {
  title: string;
  description: string;
  category: string;
  durationSeconds: number;
}

const CATEGORIES = [
  "All",
  "creative sketching",
  "language learning",
  "mindfulness",
  "physical movement",
  "gratitude reflection",
  "trivia",
  "music",
  "coding puzzle",
];

export default function ChallengesPage() {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchChallenges();
  }, []);

  const fetchChallenges = async () => {
    try {
      const res = await fetch("/api/challenges/all", { credentials: "include" });
      const data = await res.json();
      if (data.success) {
        setChallenges(data.challenges);
      }
    } catch (error) {
      console.error("Failed to fetch challenges:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredChallenges = challenges.filter((challenge) => {
    const matchesCategory = selectedCategory === "All" || challenge.category === selectedCategory;
    const matchesSearch = challenge.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         challenge.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="flex min-h-screen bg-brand-bg">
      <Sidebar />
      
      <main className="page-shell-main">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-serif font-bold mb-2">
            Browse Challenges 🎯
          </h1>
          <p className="text-brand-muted text-lg">
            Explore all available 60-second micro-challenges
          </p>
        </div>

        {/* Filters */}
        <div className="mb-6 flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-muted" />
            <input
              type="text"
              placeholder="Search challenges..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-brand-border focus:outline-none focus:ring-2 focus:ring-brand-accent"
            />
          </div>

          {/* Category Filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-brand-muted" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-3 rounded-xl border border-brand-border focus:outline-none focus:ring-2 focus:ring-brand-accent bg-white"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Challenges Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-brand-accent border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-brand-muted">Loading challenges...</p>
            </div>
          </div>
        ) : (
          <>
            <div className="mb-4 text-sm text-brand-muted">
              Showing {filteredChallenges.length} challenge{filteredChallenges.length !== 1 ? 's' : ''}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredChallenges.map((challenge, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ y: -4 }}
                  className="bg-white p-6 rounded-2xl border border-brand-border shadow-sm hover:shadow-md transition-all"
                >
                  {/* Category Badge */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-brand-accent/10 text-brand-accent text-xs font-semibold rounded-full">
                      <Sparkles className="w-3 h-3" />
                      {challenge.category}
                    </span>
                    <div className="flex items-center gap-1 text-brand-muted text-sm">
                      <Clock className="w-4 h-4" />
                      <span>{challenge.durationSeconds}s</span>
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-serif font-bold mb-2">
                    {challenge.title}
                  </h3>

                  {/* Description */}
                  <p className="text-brand-muted text-sm mb-4">
                    {challenge.description}
                  </p>

                  {/* Action */}
                  <button className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-brand-accent text-white rounded-lg hover:bg-brand-accent/90 transition-colors">
                    <Target className="w-4 h-4" />
                    <span className="font-medium">Try This Challenge</span>
                  </button>
                </motion.div>
              ))}
            </div>

            {filteredChallenges.length === 0 && (
              <div className="text-center py-20">
                <div className="w-20 h-20 bg-brand-bg rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target className="w-10 h-10 text-brand-muted" />
                </div>
                <h3 className="text-xl font-semibold mb-2">No challenges found</h3>
                <p className="text-brand-muted">Try adjusting your filters or search query</p>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
