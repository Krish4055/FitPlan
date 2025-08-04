import { type User, type InsertUser, type Workout, type InsertWorkout, type FoodLog, type InsertFoodLog } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, updates: Partial<InsertUser>): Promise<User | undefined>;

  // Workout operations
  getWorkouts(userId: string): Promise<Workout[]>;
  getWorkout(id: string): Promise<Workout | undefined>;
  createWorkout(workout: InsertWorkout): Promise<Workout>;
  deleteWorkout(id: string): Promise<boolean>;

  // Food log operations
  getFoodLogs(userId: string): Promise<FoodLog[]>;
  getFoodLogsByDate(userId: string, date: string): Promise<FoodLog[]>;
  createFoodLog(foodLog: InsertFoodLog): Promise<FoodLog>;
  deleteFoodLog(id: string): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private workouts: Map<string, Workout>;
  private foodLogs: Map<string, FoodLog>;

  constructor() {
    this.users = new Map();
    this.workouts = new Map();
    this.foodLogs = new Map();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email === email,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { 
      ...insertUser, 
      id,
      createdAt: new Date()
    };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: string, updates: Partial<InsertUser>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;

    const updatedUser = { ...user, ...updates };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async getWorkouts(userId: string): Promise<Workout[]> {
    return Array.from(this.workouts.values())
      .filter(workout => workout.userId === userId)
      .sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime());
  }

  async getWorkout(id: string): Promise<Workout | undefined> {
    return this.workouts.get(id);
  }

  async createWorkout(insertWorkout: InsertWorkout): Promise<Workout> {
    const id = randomUUID();
    const workout: Workout = {
      ...insertWorkout,
      id,
      createdAt: new Date()
    };
    this.workouts.set(id, workout);
    return workout;
  }

  async deleteWorkout(id: string): Promise<boolean> {
    return this.workouts.delete(id);
  }

  async getFoodLogs(userId: string): Promise<FoodLog[]> {
    return Array.from(this.foodLogs.values())
      .filter(log => log.userId === userId)
      .sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime());
  }

  async getFoodLogsByDate(userId: string, date: string): Promise<FoodLog[]> {
    const targetDate = new Date(date);
    const nextDate = new Date(targetDate);
    nextDate.setDate(nextDate.getDate() + 1);

    return Array.from(this.foodLogs.values())
      .filter(log => 
        log.userId === userId && 
        log.createdAt && 
        new Date(log.createdAt) >= targetDate && 
        new Date(log.createdAt) < nextDate
      );
  }

  async createFoodLog(insertFoodLog: InsertFoodLog): Promise<FoodLog> {
    const id = randomUUID();
    const foodLog: FoodLog = {
      ...insertFoodLog,
      id,
      createdAt: new Date()
    };
    this.foodLogs.set(id, foodLog);
    return foodLog;
  }

  async deleteFoodLog(id: string): Promise<boolean> {
    return this.foodLogs.delete(id);
  }
}

export const storage = new MemStorage();
