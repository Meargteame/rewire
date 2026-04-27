import { useState } from "react";
import { motion } from "motion/react";
import Sidebar from "../components/Sidebar";
import { useAuth } from "../contexts/AuthContext";
import { User, Mail, Lock, Bell, Palette, Save, AlertCircle } from "lucide-react";

export default function SettingsPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<"profile" | "preferences">("profile");
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [dailyGoal, setDailyGoal] = useState(3);
  const [notifications, setNotifications] = useState(true);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  if (!user) return null;

  const handleSaveProfile = async () => {
    setSaveStatus("saving");
    setErrorMessage("");

    // Simulate API call (implement actual API endpoint later)
    setTimeout(() => {
      setSaveStatus("success");
      setTimeout(() => setSaveStatus("idle"), 2000);
    }, 1000);
  };

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      setErrorMessage("Passwords don't match");
      setSaveStatus("error");
      return;
    }

    if (newPassword.length < 6) {
      setErrorMessage("Password must be at least 6 characters");
      setSaveStatus("error");
      return;
    }

    setSaveStatus("saving");
    setErrorMessage("");

    // Simulate API call (implement actual API endpoint later)
    setTimeout(() => {
      setSaveStatus("success");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setTimeout(() => setSaveStatus("idle"), 2000);
    }, 1000);
  };

  const handleSavePreferences = async () => {
    setSaveStatus("saving");
    setErrorMessage("");

    // Simulate API call (implement actual API endpoint later)
    setTimeout(() => {
      setSaveStatus("success");
      setTimeout(() => setSaveStatus("idle"), 2000);
    }, 1000);
  };

  return (
    <div className="flex min-h-screen bg-brand-bg">
      <Sidebar />
      
      <main className="flex-1 ml-64 p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-serif font-bold mb-2">
            Settings ⚙️
          </h1>
          <p className="text-brand-muted text-lg">
            Manage your account and preferences
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-6 border-b border-brand-border">
          <button
            onClick={() => setActiveTab("profile")}
            className={`px-4 py-3 font-medium transition-colors relative ${
              activeTab === "profile"
                ? "text-brand-accent"
                : "text-brand-muted hover:text-brand-text"
            }`}
          >
            Profile & Security
            {activeTab === "profile" && (
              <motion.div
                layoutId="activeTab"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-accent"
              />
            )}
          </button>
          <button
            onClick={() => setActiveTab("preferences")}
            className={`px-4 py-3 font-medium transition-colors relative ${
              activeTab === "preferences"
                ? "text-brand-accent"
                : "text-brand-muted hover:text-brand-text"
            }`}
          >
            Preferences
            {activeTab === "preferences" && (
              <motion.div
                layoutId="activeTab"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-accent"
              />
            )}
          </button>
        </div>

        {/* Profile & Security Tab */}
        {activeTab === "profile" && (
          <div className="max-w-2xl space-y-6">
            {/* Profile Information */}
            <div className="bg-white p-6 rounded-2xl border border-brand-border">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-brand-accent/10 rounded-xl flex items-center justify-center">
                  <User className="w-5 h-5 text-brand-accent" />
                </div>
                <h2 className="text-xl font-serif font-bold">Profile Information</h2>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-brand-border focus:outline-none focus:ring-2 focus:ring-brand-accent"
                    placeholder="Your name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-muted" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 rounded-xl border border-brand-border focus:outline-none focus:ring-2 focus:ring-brand-accent"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>

                <button
                  onClick={handleSaveProfile}
                  disabled={saveStatus === "saving"}
                  className="flex items-center gap-2 px-6 py-3 bg-brand-accent text-white rounded-xl hover:bg-brand-accent/90 transition-colors disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  {saveStatus === "saving" ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </div>

            {/* Change Password */}
            <div className="bg-white p-6 rounded-2xl border border-brand-border">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
                  <Lock className="w-5 h-5 text-red-600" />
                </div>
                <h2 className="text-xl font-serif font-bold">Change Password</h2>
              </div>

              {errorMessage && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-800">{errorMessage}</p>
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Current Password</label>
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-brand-border focus:outline-none focus:ring-2 focus:ring-brand-accent"
                    placeholder="Enter current password"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">New Password</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-brand-border focus:outline-none focus:ring-2 focus:ring-brand-accent"
                    placeholder="Enter new password"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Confirm New Password</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-brand-border focus:outline-none focus:ring-2 focus:ring-brand-accent"
                    placeholder="Confirm new password"
                  />
                </div>

                <button
                  onClick={handleChangePassword}
                  disabled={saveStatus === "saving" || !currentPassword || !newPassword || !confirmPassword}
                  className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors disabled:opacity-50"
                >
                  <Lock className="w-4 h-4" />
                  {saveStatus === "saving" ? "Updating..." : "Update Password"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Preferences Tab */}
        {activeTab === "preferences" && (
          <div className="max-w-2xl space-y-6">
            {/* Daily Goal */}
            <div className="bg-white p-6 rounded-2xl border border-brand-border">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                  <Palette className="w-5 h-5 text-green-600" />
                </div>
                <h2 className="text-xl font-serif font-bold">Daily Goal</h2>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Challenges per day: {dailyGoal}
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={dailyGoal}
                    onChange={(e) => setDailyGoal(Number(e.target.value))}
                    className="w-full h-2 bg-brand-border rounded-lg appearance-none cursor-pointer accent-brand-accent"
                  />
                  <div className="flex justify-between text-xs text-brand-muted mt-2">
                    <span>1 challenge</span>
                    <span>10 challenges</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Notifications */}
            <div className="bg-white p-6 rounded-2xl border border-brand-border">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                  <Bell className="w-5 h-5 text-blue-600" />
                </div>
                <h2 className="text-xl font-serif font-bold">Notifications</h2>
              </div>

              <div className="space-y-4">
                <label className="flex items-center justify-between p-4 rounded-xl hover:bg-brand-bg cursor-pointer transition-colors">
                  <div>
                    <p className="font-medium">Daily Reminders</p>
                    <p className="text-sm text-brand-muted">Get notified to complete your daily challenges</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={notifications}
                    onChange={(e) => setNotifications(e.target.checked)}
                    className="w-5 h-5 rounded accent-brand-accent cursor-pointer"
                  />
                </label>
              </div>
            </div>

            <button
              onClick={handleSavePreferences}
              disabled={saveStatus === "saving"}
              className="flex items-center gap-2 px-6 py-3 bg-brand-accent text-white rounded-xl hover:bg-brand-accent/90 transition-colors disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              {saveStatus === "saving" ? "Saving..." : "Save Preferences"}
            </button>
          </div>
        )}

        {/* Success Message */}
        {saveStatus === "success" && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="fixed bottom-8 right-8 bg-green-500 text-white px-6 py-4 rounded-xl shadow-lg flex items-center gap-3"
          >
            <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
              ✓
            </div>
            <span className="font-medium">Changes saved successfully!</span>
          </motion.div>
        )}
      </main>
    </div>
  );
}
