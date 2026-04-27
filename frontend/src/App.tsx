import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { ReactNode } from "react";
import { useAuth } from "./contexts/AuthContext";
import Navbar from "./components/Navbar";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import ChallengesPage from "./pages/ChallengesPage";
import ProgressPage from "./pages/ProgressPage";
import SettingsPage from "./pages/SettingsPage";

function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-brand-accent border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-brand-muted">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

function Layout({ children }: { children: ReactNode }) {
  const location = useLocation();
  const isDashboard = location.pathname.startsWith("/dashboard") || 
                      location.pathname.startsWith("/challenges") || 
                      location.pathname.startsWith("/progress") ||
                      location.pathname.startsWith("/settings");

  return (
    <div className="min-h-screen selection:bg-brand-accent/30">
      {/* Only show navbar on landing/login pages, not dashboard */}
      {!isDashboard && <Navbar />}
      {children}
      
      {/* Only show footer on landing/login pages, not dashboard */}
      {!isDashboard && (
        <footer className="py-12 px-6 md:px-12 lg:px-24 border-t border-brand-border bg-white">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-brand-accent rounded flex items-center justify-center">
                <span className="text-white text-sm">⚡</span>
              </div>
              <span className="font-serif text-xl font-medium">Rewire</span>
            </div>
            <div className="flex gap-8 text-sm text-brand-muted">
              <a href="#" className="hover:text-brand-accent">Privacy</a>
              <a href="#" className="hover:text-brand-accent">Terms</a>
              <a href="#" className="hover:text-brand-accent">Contact</a>
              <a href="#" className="hover:text-brand-accent">Twitter</a>
            </div>
            <div className="text-xs text-brand-muted">© 2026 Rewire Inc. All rights reserved.</div>
          </div>
        </footer>
      )}
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/challenges"
            element={
              <ProtectedRoute>
                <ChallengesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/progress"
            element={
              <ProtectedRoute>
                <ProgressPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <SettingsPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}
