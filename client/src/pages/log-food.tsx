import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { insertFoodLogSchema } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";

const formSchema = insertFoodLogSchema.extend({
  calories: insertFoodLogSchema.shape.calories,
  protein: insertFoodLogSchema.shape.protein,
  carbs: insertFoodLogSchema.shape.carbs,
  fats: insertFoodLogSchema.shape.fats,
});

export default function LogFood() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const form = useForm({
    resolver: zodResolver(formSchema.omit({ userId: true })),
    defaultValues: {
      foodName: "",
      servingSize: "",
      calories: 0,
      protein: "0",
      carbs: "0",
      fats: "0",
      mealType: "",
    },
  });

  const createFoodLogMutation = useMutation({
    mutationFn: async (data: any) => {
      return apiRequest("POST", "/api/food-logs", data);
    },
    onSuccess: () => {
      toast({
        title: "Success!",
        description: "Food logged successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/food-logs"] });
      form.reset();
      setLocation("/dashboard");
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to log food",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: any) => {
    createFoodLogMutation.mutate(data);
  };

  return (
    <div className="min-h-screen pt-20 pb-8 bg-[var(--dark-bg)]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-black text-white mb-4">Log Food</h2>
          <p className="text-xl text-gray-400">Track your nutrition and stay on target with your goals</p>
        </div>
        
        <Card className="bg-dark-card border-gray-800">
          <CardContent className="p-8">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="foodName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-gray-300">Food Name</FormLabel>
                        <FormControl>
                          <Input 
                            {...field}
                            className="w-full bg-gray-800 border-gray-700 text-white focus:ring-2 focus:ring-primary-green focus:border-transparent" 
                            placeholder="e.g., Grilled Chicken Breast"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="servingSize"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-gray-300">Serving Size</FormLabel>
                        <FormControl>
                          <Input 
                            {...field}
                            className="w-full bg-gray-800 border-gray-700 text-white focus:ring-2 focus:ring-primary-green focus:border-transparent" 
                            placeholder="e.g., 100g"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <FormField
                    control={form.control}
                    name="calories"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-gray-300">Calories</FormLabel>
                        <FormControl>
                          <Input 
                            {...field}
                            type="number"
                            onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                            className="w-full bg-gray-800 border-gray-700 text-white focus:ring-2 focus:ring-primary-green focus:border-transparent" 
                            placeholder="250"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="protein"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-gray-300">Protein (g)</FormLabel>
                        <FormControl>
                          <Input 
                            {...field}
                            className="w-full bg-gray-800 border-gray-700 text-white focus:ring-2 focus:ring-primary-green focus:border-transparent" 
                            placeholder="30"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="carbs"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-gray-300">Carbs (g)</FormLabel>
                        <FormControl>
                          <Input 
                            {...field}
                            className="w-full bg-gray-800 border-gray-700 text-white focus:ring-2 focus:ring-primary-green focus:border-transparent" 
                            placeholder="5"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="fats"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-gray-300">Fats (g)</FormLabel>
                        <FormControl>
                          <Input 
                            {...field}
                            className="w-full bg-gray-800 border-gray-700 text-white focus:ring-2 focus:ring-primary-green focus:border-transparent" 
                            placeholder="8"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="mealType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-300">Meal Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="w-full bg-gray-800 border-gray-700 text-white focus:ring-2 focus:ring-primary-green focus:border-transparent">
                            <SelectValue placeholder="Select meal type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Breakfast">Breakfast</SelectItem>
                          <SelectItem value="Lunch">Lunch</SelectItem>
                          <SelectItem value="Dinner">Dinner</SelectItem>
                          <SelectItem value="Snack">Snack</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="flex justify-end space-x-4">
                  <Button 
                    type="button" 
                    variant="outline"
                    className="px-6 py-3 border-gray-700 text-gray-300 hover:bg-gray-800"
                    onClick={() => setLocation("/dashboard")}
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    className="px-6 py-3 bg-gradient-green-blue font-semibold hover:shadow-lg transition-all duration-200"
                    disabled={createFoodLogMutation.isPending}
                  >
                    {createFoodLogMutation.isPending ? "Logging..." : "Log Food"}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
