import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { Plus, Clock } from "lucide-react";

const mealData = [
  {
    id: "breakfast",
    title: "Breakfast",
    meals: [
      { name: "Protein Power Bowl", calories: 450, protein: "35g" },
      { name: "Green Smoothie", calories: 180, protein: "8g" }
    ]
  },
  {
    id: "lunch",
    title: "Lunch",
    meals: [
      { name: "Protein Power Bowl", calories: 450, protein: "35g" },
      { name: "Green Smoothie", calories: 180, protein: "8g" }
    ]
  },
  {
    id: "dinner",
    title: "Dinner",
    meals: [
      { name: "Protein Power Bowl", calories: 450, protein: "35g" },
      { name: "Green Smoothie", calories: 180, protein: "8g" }
    ]
  }
];

export default function MealPlan() {
  const [, setLocation] = useLocation();

  return (
    <section className="py-20 bg-[var(--dark-bg)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-12">
          <h2 className="text-4xl font-black text-white">Today's Meal Plan</h2>
          <Button 
            className="bg-primary-green px-6 py-3 rounded-xl font-semibold hover:bg-green-600 transition-colors flex items-center space-x-2"
            onClick={() => setLocation("/log-food")}
          >
            <Plus className="w-5 h-5" />
            <span>Add Meal</span>
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {mealData.map((mealTime) => (
            <div key={mealTime.id} className="bg-dark-card border border-gray-800 rounded-2xl p-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-primary-green">{mealTime.title}</h3>
                <Clock className="text-gray-500" />
              </div>
              
              <div className="space-y-4 mb-8">
                {mealTime.meals.map((meal, index) => (
                  <div key={index} className="bg-gray-800 rounded-xl p-4">
                    <h4 className="font-semibold text-white mb-2">{meal.name}</h4>
                    <p className="text-sm text-gray-400">{meal.calories} cal • {meal.protein} protein</p>
                  </div>
                ))}
              </div>
              
              <Button 
                variant="outline"
                className="w-full bg-transparent border border-gray-700 text-white py-3 rounded-xl hover:bg-gray-800 transition-colors"
              >
                View Details
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
