import { Link } from "wouter";
import { Dumbbell } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-dark-card border-t border-gray-800 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-gradient-blue-green rounded-xl flex items-center justify-center">
                <Dumbbell className="text-white text-lg" />
              </div>
              <span className="text-xl font-bold text-white">FitPlan</span>
            </div>
            <p className="text-gray-400 max-w-md">
              Transform your life with our AI-powered fitness and nutrition planner. 
              Track your progress, achieve your goals, and become the best version of yourself.
            </p>
          </div>
          
          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-gray-400">
              <li><Link href="/dashboard" className="hover:text-white transition-colors">Dashboard</Link></li>
              <li><Link href="/log-food" className="hover:text-white transition-colors">Log Food</Link></li>
              <li><Link href="/log-workout" className="hover:text-white transition-colors">Log Workout</Link></li>
              <li><Link href="/settings" className="hover:text-white transition-colors">Settings</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2024 FitPlan. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
