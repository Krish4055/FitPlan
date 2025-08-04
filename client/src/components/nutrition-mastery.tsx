import { Utensils, BarChart3, Apple, Pill } from "lucide-react";

const nutritionFeatures = [
  {
    id: "meal-planning",
    title: "Meal Planning",
    description: "AI-generated meal plans tailored to your goals",
    icon: Utensils,
    color: "bg-primary-green",
    textColor: "text-primary-green",
    features: ["2000+ Recipes", "Custom Macros", "Prep Time < 30min"]
  },
  {
    id: "nutrition-tracking",
    title: "Nutrition Tracking",
    description: "Track calories, macros, and micronutrients",
    icon: BarChart3,
    color: "bg-primary-blue",
    textColor: "text-primary-blue",
    features: ["Barcode Scanner", "Smart Suggestions", "Progress Analytics"]
  },
  {
    id: "healthy-recipes",
    title: "Healthy Recipes",
    description: "Delicious recipes for every dietary need",
    icon: Apple,
    color: "bg-accent-orange",
    textColor: "text-accent-orange",
    features: ["Vegan Options", "Keto Friendly", "Gluten Free"]
  },
  {
    id: "supplement-guide",
    title: "Supplement Guide",
    description: "Personalized supplement recommendations",
    icon: Pill,
    color: "bg-accent-coral",
    textColor: "text-accent-coral",
    features: ["Science-Based", "Goal Oriented", "Timing Optimized"]
  }
];

export default function NutritionMastery() {
  return (
    <section className="py-20 bg-[var(--dark-bg)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-black mb-6 text-white">NUTRITION MASTERY</h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Fuel your body with precision. Our AI-powered nutrition system optimizes every meal for your goals
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {nutritionFeatures.map((feature) => (
            <div 
              key={feature.id}
              className="bg-dark-card border border-gray-800 rounded-2xl p-8 hover:scale-105 transition-all duration-300"
            >
              <div className={`w-16 h-16 ${feature.color} rounded-2xl flex items-center justify-center mb-6`}>
                <feature.icon className="text-white text-2xl" />
              </div>
              <h3 className={`text-2xl font-bold ${feature.textColor} mb-4`}>
                {feature.title}
              </h3>
              <p className="text-gray-400 mb-6">{feature.description}</p>
              <ul className="space-y-3 text-gray-300">
                {feature.features.map((item) => (
                  <li key={item} className="flex items-center">
                    <div className={`w-2 h-2 ${feature.color} rounded-full mr-3`} />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
