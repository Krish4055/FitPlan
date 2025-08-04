import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Bolt, Play } from "lucide-react";

export default function HeroSection() {
  const [, setLocation] = useLocation();

  return (
    <section className="min-h-screen flex items-center justify-center relative overflow-hidden pt-16">
      {/* Background with fitness imagery */}
      <div className="absolute inset-0 bg-gradient-to-br from-[var(--dark-bg)] via-gray-900 to-[var(--dark-bg)]">
        <div 
          className="absolute inset-0 opacity-30 bg-cover bg-center"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1920&h=1080')"
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
            The ultimate AI-powered fitness & nutrition planner that adapts to your lifestyle. 
            <span className="text-primary-green font-semibold"> Track, Plan, Achieve.</span>
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
          <Button 
            variant="outline"
            className="border border-gray-600 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-gray-800 transition-all duration-300 flex items-center space-x-3"
          >
            <Play className="w-5 h-5" />
            <span>Watch Demo</span>
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
