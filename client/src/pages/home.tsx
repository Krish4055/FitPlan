import HeroSection from "@/components/hero-section";
import WorkoutCategories from "@/components/workout-categories";
import NutritionMastery from "@/components/nutrition-mastery";
import ProgressTracking from "@/components/progress-tracking";
import MealPlan from "@/components/meal-plan";

export default function Home() {
  return (
    <div>
      <HeroSection />
      <WorkoutCategories />
      <NutritionMastery />
      <ProgressTracking />
      <MealPlan />
    </div>
  );
}
