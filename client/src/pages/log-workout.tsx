import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { insertWorkoutSchema } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";

const formSchema = insertWorkoutSchema.extend({
  duration: insertWorkoutSchema.shape.duration,
  caloriesBurned: insertWorkoutSchema.shape.caloriesBurned,
});

export default function LogWorkout() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const form = useForm({
    resolver: zodResolver(formSchema.omit({ userId: true })),
    defaultValues: {
      workoutType: "",
      duration: 0,
      caloriesBurned: 0,
      intensity: "",
      exerciseDetails: "",
      feeling: "",
    },
  });

  const createWorkoutMutation = useMutation({
    mutationFn: async (data: any) => {
      return apiRequest("POST", "/api/workouts", data);
    },
    onSuccess: () => {
      toast({
        title: "Success!",
        description: "Workout logged successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/workouts"] });
      form.reset();
      setLocation("/dashboard");
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to log workout",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: any) => {
    createWorkoutMutation.mutate(data);
  };

  return (
    <div className="min-h-screen pt-20 pb-8 bg-[var(--dark-bg)]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-black text-white mb-4">Log Workout</h2>
          <p className="text-xl text-gray-400">Record your training sessions and track your fitness progress</p>
        </div>
        
        <Card className="bg-dark-card border-gray-800">
          <CardContent className="p-8">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="workoutType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-gray-300">Workout Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="w-full bg-gray-800 border-gray-700 text-white focus:ring-2 focus:ring-primary-blue focus:border-transparent">
                              <SelectValue placeholder="Select workout type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Strength Training">Strength Training</SelectItem>
                            <SelectItem value="HIIT Workout">HIIT Workout</SelectItem>
                            <SelectItem value="Endurance">Endurance</SelectItem>
                            <SelectItem value="Flexibility">Flexibility</SelectItem>
                            <SelectItem value="Sports">Sports</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="duration"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-gray-300">Duration (minutes)</FormLabel>
                        <FormControl>
                          <Input 
                            {...field}
                            type="number"
                            onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                            className="w-full bg-gray-800 border-gray-700 text-white focus:ring-2 focus:ring-primary-blue focus:border-transparent" 
                            placeholder="45"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="caloriesBurned"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-gray-300">Calories Burned</FormLabel>
                        <FormControl>
                          <Input 
                            {...field}
                            type="number"
                            onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                            className="w-full bg-gray-800 border-gray-700 text-white focus:ring-2 focus:ring-primary-blue focus:border-transparent" 
                            placeholder="400"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="intensity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-gray-300">Intensity</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="w-full bg-gray-800 border-gray-700 text-white focus:ring-2 focus:ring-primary-blue focus:border-transparent">
                              <SelectValue placeholder="Select intensity" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Low">Low</SelectItem>
                            <SelectItem value="Moderate">Moderate</SelectItem>
                            <SelectItem value="High">High</SelectItem>
                            <SelectItem value="Very High">Very High</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="exerciseDetails"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-300">Exercise Details</FormLabel>
                      <FormControl>
                        <Textarea 
                          {...field}
                          className="w-full bg-gray-800 border-gray-700 text-white focus:ring-2 focus:ring-primary-blue focus:border-transparent h-32" 
                          placeholder="Describe your workout routine, exercises performed, sets, reps, weights, etc."
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="feeling"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel className="text-sm font-medium text-gray-300">How did you feel?</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex space-x-4"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="exhausted" id="exhausted" />
                            <Label htmlFor="exhausted" className="text-gray-300">😫 Exhausted</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="tired" id="tired" />
                            <Label htmlFor="tired" className="text-gray-300">😅 Tired</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="good" id="good" />
                            <Label htmlFor="good" className="text-gray-300">😊 Good</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="strong" id="strong" />
                            <Label htmlFor="strong" className="text-gray-300">💪 Strong</Label>
                          </div>
                        </RadioGroup>
                      </FormControl>
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
                    className="px-6 py-3 bg-gradient-to-r from-primary-blue to-purple-500 font-semibold hover:shadow-lg transition-all duration-200"
                    disabled={createWorkoutMutation.isPending}
                  >
                    {createWorkoutMutation.isPending ? "Logging..." : "Log Workout"}
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
