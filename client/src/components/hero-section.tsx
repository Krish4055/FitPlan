import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Bolt } from "lucide-react";
import { useState, useEffect } from "react";
import heroImage from "@assets/image_1754317580244.png";

const motivationalQuotes = [
  "The only bad workout is the one that didn't happen.",
  "Your body can stand almost anything. It's your mind you have to convince.",
  "Success starts with self-discipline.",
  "Don't wish for it, work for it.",
  "The pain you feel today will be the strength you feel tomorrow.",
  "Champions train, losers complain.",
  "Your only limit is your mind.",
  "Push harder than yesterday if you want a different tomorrow.",
  "Great things never come from comfort zones.",
  "Believe in yourself and all that you are."
];

export default function HeroSection() {
  const [, setLocation] = useLocation();
  const [currentQuote, setCurrentQuote] = useState("");

  useEffect(() => {
    const randomQuote = motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];
    setCurrentQuote(randomQuote);
  }, []);

  return (
    <section className="min-h-screen flex items-center justify-center relative overflow-hidden pt-16">
      {/* Background with fitness imagery */}
      <div className="absolute inset-0 bg-gradient-to-br from-[var(--dark-bg)] via-gray-900 to-[var(--dark-bg)]">
        <div 
          className="absolute inset-0 opacity-40 bg-cover bg-center"
          style={{
            backgroundImage: `url(${heroImage})`
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[var(--dark-bg)]/90 via-transparent to-[var(--dark-bg)]/90" />
      </div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Hero Content */}
        <div className="mb-8">
          <h1 className="text-6xl md:text-8xl font-black mb-6 leading-tight">
            <span className="text-gradient-blue-green">
              TRANSFORM
            </span>
            <br />
            <span className="text-white">YOUR LIFE</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-400 max-w-4xl mx-auto mb-12 leading-relaxed">
            <span className="text-primary-green font-semibold italic">"{currentQuote}"</span>
          </p>
        </div>
        
        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-16">
          <Button 
            className="bg-gradient-blue-green px-8 py-4 rounded-xl font-semibold text-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 flex items-center space-x-3"
            onClick={() => setLocation("/dashboard")}
          >
            <Bolt className="w-5 h-5" />
            <span>Start Your Journey</span>
          </Button>
        </div>
        
        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="bg-dark-card/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-6">
            <div className="text-4xl font-black text-primary-blue mb-2">50K+</div>
            <div className="text-gray-400">Active Users</div>
          </div>
          <div className="bg-dark-card/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-6">
            <div className="text-4xl font-black text-primary-green mb-2">95%</div>
            <div className="text-gray-400">Success Rate</div>
          </div>
          <div className="bg-dark-card/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-6">
            <div className="text-4xl font-black text-accent-orange mb-2">24/7</div>
            <div className="text-gray-400">AI Support</div>
          </div>
        </div>
      </div>
    </section>
  );
}