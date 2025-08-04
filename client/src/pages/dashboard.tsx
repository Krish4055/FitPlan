import { useQuery } from "@tanstack/react-query";
import { TrendingUp, Dumbbell, Flame, Target } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const progressData = [
  {
    id: "weight",
    title: "Weight Progress",
    value: "-12.5",
    unit: "lbs",
    change: "+5.2% this week",
    icon: TrendingUp,
    color: "bg-primary-blue",
    textColor: "text-primary-blue"
  },
  {
    id: "workouts",
    title: "Workouts Completed",
    value: "28",
    unit: "this month",
    change: "7 day streak!",
    icon: Dumbbell,
    color: "bg-primary-green",
    textColor: "text-primary-green"
  },
  {
    id: "calories",
    title: "Calories Burned",
    value: "2,847",
    unit: "today",
    change: "Goal: 2,500",
    icon: Flame,
    color: "bg-accent-orange",
    textColor: "text-accent-orange"
  },
  {
    id: "goals",
    title: "Goals Achieved",
    value: "89",
    unit: "%",
    change: "This month",
    icon: Target,
    color: "bg-accent-coral",
    textColor: "text-accent-coral"
  }
];

export default function Dashboard() {
  const { data: workouts, isLoading: workoutsLoading } = useQuery({
    queryKey: ["/api/workouts"],
  });

  const { data: foodLogs, isLoading: foodLoading } = useQuery({
    queryKey: ["/api/food-logs"],
  });

  return (
    <div className="min-h-screen pt-20 pb-8 bg-[var(--dark-bg)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Progress Tracking Header */}
        <div className="text-center mb-16">
          <h2 className="text-5xl font-black mb-6">
            <span className="text-primary-blue">TRACK YOUR</span> 
            <span className="text-white"> PROGRESS</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Visualize your fitness journey with real-time analytics and intelligent insights
          </p>
        </div>
        
        {/* Progress Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {progressData.map((metric) => (
            <Card key={metric.id} className="bg-dark-card border-gray-800 hover:scale-105 transition-all duration-300">
              <CardContent className="p-8">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 ${metric.color} rounded-xl flex items-center justify-center`}>
                    <metric.icon className="text-white text-xl" />
                  </div>
                  <div className={metric.textColor}>
                    <TrendingUp className="text-sm" />
                  </div>
                </div>
                <h3 className="text-gray-400 text-sm font-medium mb-2">{metric.title}</h3>
                <div className={`text-3xl font-black ${metric.textColor} mb-1`}>{metric.value}</div>
                <div className="text-sm text-gray-500">{metric.unit}</div>
                <div className="text-xs text-gray-500 mt-2">{metric.change}</div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {/* Chart Placeholder */}
        <Card className="bg-dark-card border-gray-800">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-white">Weight Progress Chart</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 bg-gray-800 rounded-xl flex items-center justify-center">
              <div className="text-center">
                <TrendingUp className="text-4xl text-gray-600 mb-4 mx-auto" />
                <p className="text-gray-500">Chart.js integration placeholder</p>
                <p className="text-sm text-gray-600 mt-2">Progress visualization will be displayed here</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
