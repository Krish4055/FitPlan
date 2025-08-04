import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, insertWorkoutSchema, insertFoodLogSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // User routes
  app.post("/api/users", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const user = await storage.createUser(userData);
      res.json(user);
    } catch (error) {
      res.status(400).json({ message: error instanceof Error ? error.message : "Invalid user data" });
    }
  });

  app.get("/api/users/:id", async (req, res) => {
    try {
      const user = await storage.getUser(req.params.id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.patch("/api/users/:id", async (req, res) => {
    try {
      const updates = insertUserSchema.partial().parse(req.body);
      const user = await storage.updateUser(req.params.id, updates);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    } catch (error) {
      res.status(400).json({ message: error instanceof Error ? error.message : "Invalid update data" });
    }
  });

  // Workout routes
  app.get("/api/workouts/:userId", async (req, res) => {
    try {
      const workouts = await storage.getWorkouts(req.params.userId);
      res.json(workouts);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/workouts", async (req, res) => {
    try {
      const workoutData = insertWorkoutSchema.parse(req.body);
      const workout = await storage.createWorkout(workoutData);
      res.json(workout);
    } catch (error) {
      res.status(400).json({ message: error instanceof Error ? error.message : "Invalid workout data" });
    }
  });

  app.delete("/api/workouts/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteWorkout(req.params.id);
      if (!deleted) {
        return res.status(404).json({ message: "Workout not found" });
      }
      res.json({ message: "Workout deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Food log routes
  app.get("/api/food-logs/:userId", async (req, res) => {
    try {
      const { date } = req.query;
      let foodLogs;
      
      if (date && typeof date === 'string') {
        foodLogs = await storage.getFoodLogsByDate(req.params.userId, date);
      } else {
        foodLogs = await storage.getFoodLogs(req.params.userId);
      }
      
      res.json(foodLogs);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/food-logs", async (req, res) => {
    try {
      const foodLogData = insertFoodLogSchema.parse(req.body);
      const foodLog = await storage.createFoodLog(foodLogData);
      res.json(foodLog);
    } catch (error) {
      res.status(400).json({ message: error instanceof Error ? error.message : "Invalid food log data" });
    }
  });

  app.delete("/api/food-logs/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteFoodLog(req.params.id);
      if (!deleted) {
        return res.status(404).json({ message: "Food log not found" });
      }
      res.json({ message: "Food log deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
