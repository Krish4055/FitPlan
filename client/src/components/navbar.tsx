import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Dumbbell } from "lucide-react";

export default function Navbar() {
  const [location] = useLocation();

  const navItems = [
    { path: "/dashboard", label: "Dashboard" },
    { path: "/log-food", label: "Log Food" },
    { path: "/log-workout", label: "Log Workout" },
    { path: "/settings", label: "Settings" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[var(--dark-bg)]/80 backdrop-blur-md border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-blue-green rounded-xl flex items-center justify-center">
              <Dumbbell className="text-white text-lg" />
            </div>
            <span className="text-xl font-bold text-white">FitPlan</span>
          </Link>
          
          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className={`transition-colors ${
                  location === item.path
                    ? "text-white"
                    : "text-gray-300 hover:text-white"
                }`}
              >
                {item.label}
              </Link>
            ))}
            <Link href="/signin" className="text-gray-300 hover:text-white transition-colors">
              Sign In
            </Link>
            <Button className="bg-gradient-green-blue px-6 py-2 rounded-lg font-semibold hover:shadow-lg transition-all duration-200">
              Get Started
            </Button>
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden">
            <button className="text-gray-300 hover:text-white">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
