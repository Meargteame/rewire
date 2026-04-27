import { Link, useLocation } from "react-router-dom";
import { Home, Target, TrendingUp, Settings, Zap, LogOut, Menu, X } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useState } from "react";

export default function Sidebar() {
  const location = useLocation();
  const { logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { path: "/dashboard", icon: Home, label: "Dashboard" },
    { path: "/challenges", icon: Target, label: "Challenges" },
    { path: "/progress", icon: TrendingUp, label: "Progress" },
    { path: "/settings", icon: Settings, label: "Settings" },
  ];

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden fixed top-4 left-4 z-50 w-10 h-10 bg-white rounded-xl border border-brand-border flex items-center justify-center shadow-lg"
      >
        {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="md:hidden fixed inset-0 bg-black/50 z-30"
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed left-0 top-0 h-screen w-64 bg-white border-r border-brand-border flex flex-col z-40 transition-transform duration-300 ${
        isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      }`}>
        {/* Logo */}
        <Link to="/dashboard" className="flex items-center gap-3 px-6 py-5 border-b border-brand-border" onClick={() => setIsOpen(false)}>
          <div className="w-10 h-10 bg-brand-accent rounded-xl flex items-center justify-center">
            <Zap className="w-6 h-6 text-white" />
          </div>
          <span className="font-serif text-2xl font-semibold">Rewire</span>
        </Link>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg mb-1 transition-all ${
                  isActive
                    ? "bg-brand-accent text-white shadow-lg shadow-brand-accent/20"
                    : "text-brand-text hover:bg-brand-bg"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <button
          onClick={() => {
            logout();
            setIsOpen(false);
          }}
          className="flex items-center gap-3 px-7 py-4 text-brand-muted hover:text-brand-accent hover:bg-brand-bg transition-all border-t border-brand-border"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Logout</span>
        </button>
      </aside>
    </>
  );
}
