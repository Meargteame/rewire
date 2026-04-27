import { Link } from "react-router-dom";
import { Zap } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

export default function Navbar() {
  const { user } = useAuth();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass h-16 flex items-center justify-between px-6 md:px-12">
      <Link to="/" className="flex items-center gap-2">
        <div className="w-8 h-8 bg-brand-accent rounded-lg flex items-center justify-center">
          <Zap className="text-white w-5 h-5" />
        </div>
        <span className="font-serif text-2xl font-medium">Rewire</span>
      </Link>

      <div className="hidden md:flex items-center gap-8 text-sm font-medium">
        <a href="/#how" className="hover:text-brand-accent transition-colors">
          How it works
        </a>
        <a href="/#features" className="hover:text-brand-accent transition-colors">
          Features
        </a>
        <a href="/#pricing" className="hover:text-brand-accent transition-colors">
          Pricing
        </a>

        {user ? (
          <Link
            to="/dashboard"
            className="bg-brand-accent text-white px-6 py-2 rounded-button hover:bg-brand-accent/90 transition-all shadow-lg shadow-brand-accent/20"
          >
            Go to Dashboard
          </Link>
        ) : (
          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="text-brand-text hover:text-brand-accent transition-colors font-medium"
            >
              Login
            </Link>
            <Link
              to="/login"
              className="bg-brand-accent text-white px-6 py-2 rounded-button hover:bg-brand-accent/90 transition-all shadow-lg shadow-brand-accent/20"
            >
              Get Started
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
