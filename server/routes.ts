import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, insertWorkoutSchema, insertFoodLogSchema, insertWeightEntrySchema } from "@shared/schema";
import { hashPassword, authenticateUser, requireAuth } from "./auth";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Authentication routes
  app.post("/api/auth/register", async (req, res) => {
    try {
      const { password, ...userData } = insertUserSchema.parse(req.body);
      
      // Check if user already exists
      const existingUser = await storage.getUserByUsername(userData.username) || 
                           await storage.getUserByEmail(userData.email);
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }

      const hashedPassword = await hashPassword(password);
      const user = await storage.createUser({ ...userData, password: hashedPassword });
      
      // Set session
      req.session.userId = user.id;
      
      // Return user without password
      const { password: _, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error) {
      res.status(400).json({ message: error instanceof Error ? error.message : "Registration failed" });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      
      if (!username || !password) {
        return res.status(400).json({ message: "Username and password required" });
      }

      const user = await authenticateUser(username, password);
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      // Set session
      req.session.userId = user.id;
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Login failed" });
    }
  });

  app.post("/api/auth/guest", async (req, res) => {
    try {
      // Create or get guest user
      const guestUsername = `guest_${Date.now()}`;
      const guestUser = {
        username: guestUsername,
        email: `${guestUsername}@guest.com`,
        password: "guest123", // Not used for guest
        fullName: "Guest User"
      };

      const hashedPassword = await hashPassword(guestUser.password);
      const user = await storage.createUser({ ...guestUser, password: hashedPassword });
      
      // Set session
      req.session.userId = user.id;
      
      // Return user without password
      const { password: _, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error) {
      res.status(500).json({ message: "Guest login failed" });
    }
  });

  app.post("/api/auth/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: "Logout failed" });
      }
      res.json({ message: "Logged out successfully" });
    });
  });

  app.get("/api/auth/user", requireAuth, async (req, res) => {
    try {
      const user = await storage.getUser(req.userId!);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Return user without password
      const { password: _, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });
  // User profile routes
  app.patch("/api/profile", requireAuth, async (req, res) => {
    try {
      const updates = insertUserSchema.partial().omit({ password: true }).parse(req.body);
      const user = await storage.updateUser(req.userId!, updates);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Return user without password
      const { password: _, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error) {
      res.status(400).json({ message: error instanceof Error ? error.message : "Invalid update data" });
    }
  });

  // Workout routes
  app.get("/api/workouts", requireAuth, async (req, res) => {
    try {
      const workouts = await storage.getWorkouts(req.userId!);
      res.json(workouts);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/workouts", requireAuth, async (req, res) => {
    try {
      const workoutData = insertWorkoutSchema.omit({ userId: true }).parse(req.body);
      const workout = await storage.createWorkout({ ...workoutData, userId: req.userId! });
      res.json(workout);
    } catch (error) {
      res.status(400).json({ message: error instanceof Error ? error.message : "Invalid workout data" });
    }
  });

  app.delete("/api/workouts/:id", requireAuth, async (req, res) => {
    try {
      // Verify workout belongs to user
      const workout = await storage.getWorkout(req.params.id);
      if (!workout || workout.userId !== req.userId!) {
        return res.status(404).json({ message: "Workout not found" });
      }

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
  app.get("/api/food-logs", requireAuth, async (req, res) => {
    try {
      const { date } = req.query;
      let foodLogs;
      
      if (date && typeof date === 'string') {
        foodLogs = await storage.getFoodLogsByDate(req.userId!, date);
      } else {
        foodLogs = await storage.getFoodLogs(req.userId!);
      }
      
      res.json(foodLogs);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/food-logs", requireAuth, async (req, res) => {
    try {
      const foodLogData = insertFoodLogSchema.omit({ userId: true }).parse(req.body);
      const foodLog = await storage.createFoodLog({ ...foodLogData, userId: req.userId! });
      res.json(foodLog);
    } catch (error) {
      res.status(400).json({ message: error instanceof Error ? error.message : "Invalid food log data" });
    }
  });

  app.delete("/api/food-logs/:id", requireAuth, async (req, res) => {
    try {
      // First get the food log to verify ownership
      const foodLogs = await storage.getFoodLogs(req.userId!);
      const foodLog = foodLogs.find(log => log.id === req.params.id);
      
      if (!foodLog) {
        return res.status(404).json({ message: "Food log not found" });
      }

      const deleted = await storage.deleteFoodLog(req.params.id);
      if (!deleted) {
        return res.status(404).json({ message: "Food log not found" });
      }
      res.json({ message: "Food log deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Weight entry routes
  app.get("/api/weight-entries", requireAuth, async (req, res) => {
    try {
      const weightEntries = await storage.getWeightEntries(req.userId!);
      res.json(weightEntries);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/weight-entries", requireAuth, async (req, res) => {
    try {
      const weightEntryData = insertWeightEntrySchema.omit({ userId: true }).parse(req.body);
      const weightEntry = await storage.createWeightEntry({ ...weightEntryData, userId: req.userId! });
      res.json(weightEntry);
    } catch (error) {
      res.status(400).json({ message: error instanceof Error ? error.message : "Invalid weight entry data" });
    }
  });

  app.delete("/api/weight-entries/:id", requireAuth, async (req, res) => {
    try {
      // First get the weight entries to verify ownership
      const weightEntries = await storage.getWeightEntries(req.userId!);
      const weightEntry = weightEntries.find(entry => entry.id === req.params.id);
      
      if (!weightEntry) {
        return res.status(404).json({ message: "Weight entry not found" });
      }

      const deleted = await storage.deleteWeightEntry(req.params.id);
      if (!deleted) {
        return res.status(404).json({ message: "Weight entry not found" });
      }
      res.json({ message: "Weight entry deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
