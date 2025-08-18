import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { TrendingUp, Dumbbell, Flame, Target, Plus, Calendar, Scale } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { WeightEntry } from "@shared/schema";

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
  const [isWeightDialogOpen, setIsWeightDialogOpen] = useState(false);
  const [weightInput, setWeightInput] = useState("");
  const [notesInput, setNotesInput] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: workouts, isLoading: workoutsLoading } = useQuery({
    queryKey: ["/api/workouts"],
  });

  const { data: foodLogs, isLoading: foodLoading } = useQuery({
    queryKey: ["/api/food-logs"],
  });

  const { data: weightEntries = [], isLoading: weightEntriesLoading } = useQuery<WeightEntry[]>({
    queryKey: ["/api/weight-entries"],
  });

  const addWeightMutation = useMutation({
    mutationFn: async (data: { weight: string; notes?: string }) => {
      return await apiRequest(
        "POST",
        "/api/weight-entries",
        {
          weight: data.weight,
          notes: data.notes || null,
        },
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/weight-entries"] });
      setIsWeightDialogOpen(false);
      setWeightInput("");
      setNotesInput("");
      toast({
        title: "Weight Added",
        description: "Your weight entry has been successfully recorded.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to add weight entry. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleAddWeight = () => {
    if (!weightInput || isNaN(parseFloat(weightInput))) {
      toast({
        title: "Invalid Weight",
        description: "Please enter a valid weight value.",
        variant: "destructive",
      });
      return;
    }
    addWeightMutation.mutate({ weight: weightInput, notes: notesInput });
  };

  // Prepare chart data
  const chartData = weightEntries.map((entry) => ({
    date: format(new Date(entry.createdAt!), 'MMM dd'),
    weight: parseFloat(entry.weight),
    fullDate: entry.createdAt,
  })).reverse(); // Reverse to show oldest to newest

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
        
        {/* Weight Progress Chart */}
        <Card className="bg-dark-card border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-2xl font-bold text-white flex items-center gap-2">
              <Scale className="text-primary-blue" />
              Weight Progress Chart
            </CardTitle>
            <Dialog open={isWeightDialogOpen} onOpenChange={setIsWeightDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-primary-blue hover:bg-primary-blue/80 text-white">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Weight
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-dark-card border-gray-800">
                <DialogHeader>
                  <DialogTitle className="text-white">Add Weight Entry</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="weight" className="text-gray-300">Weight (lbs)</Label>
                    <Input
                      id="weight"
                      type="number"
                      step="0.1"
                      placeholder="Enter your weight"
                      value={weightInput}
                      onChange={(e) => setWeightInput(e.target.value)}
                      className="bg-gray-800 border-gray-700 text-white"
                    />
                  </div>
                  <div>
                    <Label htmlFor="notes" className="text-gray-300">Notes (optional)</Label>
                    <Input
                      id="notes"
                      placeholder="How are you feeling today?"
                      value={notesInput}
                      onChange={(e) => setNotesInput(e.target.value)}
                      className="bg-gray-800 border-gray-700 text-white"
                    />
                  </div>
                  <Button 
                    onClick={handleAddWeight}
                    disabled={addWeightMutation.isPending}
                    className="w-full bg-primary-blue hover:bg-primary-blue/80"
                  >
                    {addWeightMutation.isPending ? "Adding..." : "Add Weight"}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent>
            {weightEntriesLoading ? (
              <div className="h-64 bg-gray-800 rounded-xl flex items-center justify-center">
                <div className="text-center">
                  <TrendingUp className="text-4xl text-gray-600 mb-4 mx-auto animate-pulse" />
                  <p className="text-gray-500">Loading weight data...</p>
                </div>
              </div>
            ) : chartData.length === 0 ? (
              <div className="h-64 bg-gray-800 rounded-xl flex items-center justify-center">
                <div className="text-center">
                  <Scale className="text-4xl text-gray-600 mb-4 mx-auto" />
                  <p className="text-gray-500">No weight data yet</p>
                  <p className="text-sm text-gray-600 mt-2">Add your first weight entry to start tracking progress</p>
                </div>
              </div>
            ) : (
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis 
                      dataKey="date" 
                      stroke="#9CA3AF"
                      fontSize={12}
                    />
                    <YAxis 
                      stroke="#9CA3AF"
                      fontSize={12}
                      domain={['dataMin - 5', 'dataMax + 5']}
                    />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: '#1F2937',
                        border: '1px solid #374151',
                        borderRadius: '8px',
                        color: '#F3F4F6'
                      }}
                      labelStyle={{ color: '#9CA3AF' }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="weight" 
                      stroke="#3B82F6" 
                      strokeWidth={3}
                      dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6, stroke: '#3B82F6', strokeWidth: 2 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}
            
            {/* Recent Weight Entries */}
            {weightEntries.length > 0 && (
              <div className="mt-6 pt-6 border-t border-gray-800">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-primary-blue" />
                  Recent Entries
                </h3>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {weightEntries.slice(0, 5).map((entry) => (
                    <div key={entry.id} className="flex justify-between items-center p-2 bg-gray-800 rounded">
                      <div>
                        <span className="text-white font-medium">{entry.weight} lbs</span>
                        {entry.notes && (
                          <span className="text-gray-400 text-sm ml-2">- {entry.notes}</span>
                        )}
                      </div>
                      <span className="text-gray-500 text-sm">
                        {format(new Date(entry.createdAt!), 'MMM dd, yyyy')}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
