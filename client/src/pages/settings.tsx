import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { insertUserSchema } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

const profileSchema = insertUserSchema.pick({
  fullName: true,
  email: true,
  age: true,
  gender: true,
});

const goalsSchema = insertUserSchema.pick({
  currentWeight: true,
  targetWeight: true,
  primaryGoal: true,
  activityLevel: true,
  weeklyWorkoutGoal: true,
});

export default function Settings() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const mockUserId = "demo-user";

  const { data: user } = useQuery({
    queryKey: ["/api/users", mockUserId],
    enabled: false // Disabled for demo since no actual user
  });

  const profileForm = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: "",
      email: "",
      age: undefined,
      gender: "",
    },
  });

  const goalsForm = useForm({
    resolver: zodResolver(goalsSchema),
    defaultValues: {
      currentWeight: "",
      targetWeight: "",
      primaryGoal: "",
      activityLevel: "",
      weeklyWorkoutGoal: "",
    },
  });

  const updateProfileMutation = useMutation({
    mutationFn: async (data: any) => {
      return apiRequest("PATCH", `/api/users/${mockUserId}`, data);
    },
    onSuccess: () => {
      toast({
        title: "Success!",
        description: "Profile updated successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/users", mockUserId] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update profile",
        variant: "destructive",
      });
    },
  });

  const updateGoalsMutation = useMutation({
    mutationFn: async (data: any) => {
      return apiRequest("PATCH", `/api/users/${mockUserId}`, data);
    },
    onSuccess: () => {
      toast({
        title: "Success!",
        description: "Goals updated successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/users", mockUserId] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update goals",
        variant: "destructive",
      });
    },
  });

  const onProfileSubmit = (data: any) => {
    updateProfileMutation.mutate(data);
  };

  const onGoalsSubmit = (data: any) => {
    updateGoalsMutation.mutate(data);
  };

  return (
    <div className="min-h-screen pt-20 pb-8 bg-[var(--dark-bg)]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-black text-white mb-4">Settings</h2>
          <p className="text-xl text-gray-400">Customize your profile and fitness goals</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Profile Settings */}
          <Card className="bg-dark-card border-gray-800">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-white">Profile Information</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...profileForm}>
                <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-6">
                  <FormField
                    control={profileForm.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-gray-300">Full Name</FormLabel>
                        <FormControl>
                          <Input 
                            {...field}
                            className="w-full bg-gray-800 border-gray-700 text-white focus:ring-2 focus:ring-primary-green focus:border-transparent" 
                            placeholder="John Doe"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={profileForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-gray-300">Email</FormLabel>
                        <FormControl>
                          <Input 
                            {...field}
                            type="email"
                            className="w-full bg-gray-800 border-gray-700 text-white focus:ring-2 focus:ring-primary-green focus:border-transparent" 
                            placeholder="john@example.com"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={profileForm.control}
                      name="age"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium text-gray-300">Age</FormLabel>
                          <FormControl>
                            <Input 
                              {...field}
                              type="number"
                              onChange={(e) => field.onChange(parseInt(e.target.value) || undefined)}
                              className="w-full bg-gray-800 border-gray-700 text-white focus:ring-2 focus:ring-primary-green focus:border-transparent" 
                              placeholder="28"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={profileForm.control}
                      name="gender"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium text-gray-300">Gender</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="w-full bg-gray-800 border-gray-700 text-white focus:ring-2 focus:ring-primary-green focus:border-transparent">
                                <SelectValue placeholder="Select gender" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Male">Male</SelectItem>
                              <SelectItem value="Female">Female</SelectItem>
                              <SelectItem value="Other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-green-blue py-3 font-semibold hover:shadow-lg transition-all duration-200"
                    disabled={updateProfileMutation.isPending}
                  >
                    {updateProfileMutation.isPending ? "Updating..." : "Update Profile"}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
          
          {/* Fitness Goals */}
          <Card className="bg-dark-card border-gray-800">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-white">Fitness Goals</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...goalsForm}>
                <form onSubmit={goalsForm.handleSubmit(onGoalsSubmit)} className="space-y-6">
                  <FormField
                    control={goalsForm.control}
                    name="currentWeight"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-gray-300">Current Weight (lbs)</FormLabel>
                        <FormControl>
                          <Input 
                            {...field}
                            className="w-full bg-gray-800 border-gray-700 text-white focus:ring-2 focus:ring-primary-blue focus:border-transparent" 
                            placeholder="180"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={goalsForm.control}
                    name="targetWeight"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-gray-300">Target Weight (lbs)</FormLabel>
                        <FormControl>
                          <Input 
                            {...field}
                            className="w-full bg-gray-800 border-gray-700 text-white focus:ring-2 focus:ring-primary-blue focus:border-transparent" 
                            placeholder="165"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={goalsForm.control}
                    name="primaryGoal"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-gray-300">Primary Goal</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="w-full bg-gray-800 border-gray-700 text-white focus:ring-2 focus:ring-primary-blue focus:border-transparent">
                              <SelectValue placeholder="Select primary goal" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Weight Loss">Weight Loss</SelectItem>
                            <SelectItem value="Muscle Gain">Muscle Gain</SelectItem>
                            <SelectItem value="Maintain Weight">Maintain Weight</SelectItem>
                            <SelectItem value="Improve Fitness">Improve Fitness</SelectItem>
                            <SelectItem value="Build Strength">Build Strength</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={goalsForm.control}
                    name="activityLevel"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-gray-300">Activity Level</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="w-full bg-gray-800 border-gray-700 text-white focus:ring-2 focus:ring-primary-blue focus:border-transparent">
                              <SelectValue placeholder="Select activity level" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Sedentary">Sedentary</SelectItem>
                            <SelectItem value="Lightly Active">Lightly Active</SelectItem>
                            <SelectItem value="Moderately Active">Moderately Active</SelectItem>
                            <SelectItem value="Very Active">Very Active</SelectItem>
                            <SelectItem value="Extremely Active">Extremely Active</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={goalsForm.control}
                    name="weeklyWorkoutGoal"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-gray-300">Weekly Workout Goal</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="w-full bg-gray-800 border-gray-700 text-white focus:ring-2 focus:ring-primary-blue focus:border-transparent">
                              <SelectValue placeholder="Select workout goal" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="1-2 times per week">1-2 times per week</SelectItem>
                            <SelectItem value="3-4 times per week">3-4 times per week</SelectItem>
                            <SelectItem value="5-6 times per week">5-6 times per week</SelectItem>
                            <SelectItem value="Every day">Every day</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-primary-blue to-purple-500 py-3 font-semibold hover:shadow-lg transition-all duration-200"
                    disabled={updateGoalsMutation.isPending}
                  >
                    {updateGoalsMutation.isPending ? "Updating..." : "Update Goals"}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
