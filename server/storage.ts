import { users, workouts, foodLogs, weightEntries, type User, type InsertUser, type Workout, type InsertWorkout, type FoodLog, type InsertFoodLog, type WeightEntry, type InsertWeightEntry } from "@shared/schema";
import { db } from "./db";
import { eq, and, gte, lt, desc } from "drizzle-orm";
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

  // Weight entry operations
  getWeightEntries(userId: string): Promise<WeightEntry[]>;
  createWeightEntry(weightEntry: InsertWeightEntry): Promise<WeightEntry>;
  deleteWeightEntry(id: string): Promise<boolean>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    // Generate UUID manually for SQLite compatibility
    const userWithId = {
      ...insertUser,
      id: randomUUID(),
    };
    
    const [user] = await db
      .insert(users)
      .values(userWithId)
      .returning();
    
    return user;
  }

  async updateUser(id: string, updates: Partial<InsertUser>): Promise<User | undefined> {
    const [user] = await db
      .update(users)
      .set(updates)
      .where(eq(users.id, id))
      .returning();
    
    return user || undefined;
  }

  async getWorkouts(userId: string): Promise<Workout[]> {
    return db.select().from(workouts).where(eq(workouts.userId, userId)).orderBy(desc(workouts.createdAt));
  }

  async getWorkout(id: string): Promise<Workout | undefined> {
    const [workout] = await db.select().from(workouts).where(eq(workouts.id, id));
    return workout || undefined;
  }

  async createWorkout(insertWorkout: InsertWorkout): Promise<Workout> {
    const workoutWithId = {
      ...insertWorkout,
      id: randomUUID(),
    };
    
    const [workout] = await db
      .insert(workouts)
      .values(workoutWithId)
      .returning();
    
    return workout;
  }

  async deleteWorkout(id: string): Promise<boolean> {
    const result = await db.delete(workouts).where(eq(workouts.id, id));
    return result.rowsAffected !== null && result.rowsAffected > 0;
  }

  async getFoodLogs(userId: string): Promise<FoodLog[]> {
    return db.select().from(foodLogs).where(eq(foodLogs.userId, userId)).orderBy(desc(foodLogs.createdAt));
  }

  async getFoodLogsByDate(userId: string, date: string): Promise<FoodLog[]> {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    return db
      .select()
      .from(foodLogs)
      .where(
        and(
          eq(foodLogs.userId, userId),
          gte(foodLogs.createdAt, startOfDay),
          lt(foodLogs.createdAt, endOfDay)
        )
      )
      .orderBy(desc(foodLogs.createdAt));
  }

  async createFoodLog(insertFoodLog: InsertFoodLog): Promise<FoodLog> {
    const foodLogWithId = {
      ...insertFoodLog,
      id: randomUUID(),
    };
    
    const [foodLog] = await db
      .insert(foodLogs)
      .values(foodLogWithId)
      .returning();
    
    return foodLog;
  }

  async deleteFoodLog(id: string): Promise<boolean> {
    const result = await db.delete(foodLogs).where(eq(foodLogs.id, id));
    return result.rowsAffected !== null && result.rowsAffected > 0;
  }

  async getWeightEntries(userId: string): Promise<WeightEntry[]> {
    return db.select().from(weightEntries).where(eq(weightEntries.userId, userId)).orderBy(desc(weightEntries.createdAt));
  }

  async createWeightEntry(insertWeightEntry: InsertWeightEntry): Promise<WeightEntry> {
    const weightEntryWithId = {
      ...insertWeightEntry,
      id: randomUUID(),
    };
    
    const [weightEntry] = await db
      .insert(weightEntries)
      .values(weightEntryWithId)
      .returning();
    
    return weightEntry;
  }

  async deleteWeightEntry(id: string): Promise<boolean> {
    const result = await db.delete(weightEntries).where(eq(weightEntries.id, id));
    return result.rowsAffected !== null && result.rowsAffected > 0;
  }
}

export const storage = new DatabaseStorage();
