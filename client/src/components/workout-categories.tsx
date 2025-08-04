import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Dumbbell, Bolt, Heart, Leaf, ArrowRight } from "lucide-react";

const workoutCategories = [
  {
    id: "strength",
    title: "Strength Training",
    description: "Build muscle and increase power",
    icon: Dumbbell,
    color: "bg-primary-blue",
    textColor: "text-primary-blue",
    exercises: ["Push-ups", "Squats", "Deadlifts", "Pull-ups"]
  },
  {
    id: "hiit",
    title: "HIIT Workouts",
    description: "High-intensity interval training",
    icon: Bolt,
    color: "bg-primary-green",
    textColor: "text-primary-green",
    exercises: ["Burpees", "Mountain Climbers", "Jump Squats", "Sprints"]
  },
  {
    id: "endurance",
    title: "Endurance",
    description: "Boost cardiovascular health",
    icon: Heart,
    color: "bg-accent-orange",
    textColor: "text-accent-orange",
    exercises: ["Running", "Cycling", "Swimming", "Rowing"]
  },
  {
    id: "flexibility",
    title: "Flexibility",
    description: "Improve mobility and recovery",
    icon: Leaf,
    color: "bg-accent-coral",
    textColor: "text-accent-coral",
    exercises: ["Yoga", "Stretching", "Pilates", "Foam Rolling"]
  }
];

export default function WorkoutCategories() {
  const [, setLocation] = useLocation();

  return (
    <section className="py-20 bg-[var(--dark-bg)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-black mb-6">
            <span className="text-primary-blue">WORKOUT</span> 
            <span className="text-white"> CATEGORIES</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Choose from our expertly designed workout categories, each tailored to specific fitness goals
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {workoutCategories.map((category) => (
            <div 
              key={category.id}
              className="bg-dark-card border border-gray-800 rounded-2xl p-8 hover:scale-105 transition-all duration-300 group"
            >
              <div className={`w-16 h-16 ${category.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                <category.icon className="text-white text-2xl" />
              </div>
              <h3 className={`text-2xl font-bold ${category.textColor} mb-4`}>
                {category.title}
              </h3>
              <p className="text-gray-400 mb-6">{category.description}</p>
              <ul className="space-y-3 mb-8">
                {category.exercises.map((exercise) => (
                  <li key={exercise} className="flex items-center text-gray-300">
                    <div className={`w-2 h-2 ${category.color} rounded-full mr-3`} />
                    {exercise}
                  </li>
                ))}
              </ul>
              <Button 
                variant="outline"
                className="w-full bg-transparent border border-gray-700 text-white py-3 rounded-xl hover:bg-gray-800 transition-colors flex items-center justify-center space-x-2"
                onClick={() => setLocation("/log-workout")}
              >
                <span>Start Workout</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
