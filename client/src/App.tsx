import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Home from "@/pages/home";
import Dashboard from "@/pages/dashboard";
import LogFood from "@/pages/log-food";
import LogWorkout from "@/pages/log-workout";
import Settings from "@/pages/settings";
import NotFound from "@/pages/not-found";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

function Router() {
  return (
    <div className="min-h-screen bg-[var(--dark-bg)] text-white">
      <Navbar />
      <Switch>
        <Route path="/" component={Dashboard} />
        <Route path="/dashboard" component={Dashboard} />
        <Route path="/log-food" component={LogFood} />
        <Route path="/log-workout" component={LogWorkout} />
        <Route path="/settings" component={Settings} />
        <Route component={NotFound} />
      </Switch>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
