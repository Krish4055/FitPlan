import { users, workouts, foodLogs, weightEntries, type User, type InsertUser, type Workout, type InsertWorkout, type FoodLog, type InsertFoodLog, type WeightEntry, type InsertWeightEntry } from "@shared/schema";
import { db } from "./db";
import { eq, and, gte, lt, desc } from "drizzle-orm";

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
    const [user] = await db
      .insert(users)
      .values(insertUser)
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
    return await db
      .select()
      .from(workouts)
      .where(eq(workouts.userId, userId))
      .orderBy(desc(workouts.createdAt));
  }

  async getWorkout(id: string): Promise<Workout | undefined> {
    const [workout] = await db.select().from(workouts).where(eq(workouts.id, id));
    return workout || undefined;
  }

  async createWorkout(insertWorkout: InsertWorkout): Promise<Workout> {
    const [workout] = await db
      .insert(workouts)
      .values(insertWorkout)
      .returning();
    return workout;
  }

  async deleteWorkout(id: string): Promise<boolean> {
    const result = await db.delete(workouts).where(eq(workouts.id, id));
    return result.rowCount !== null && result.rowCount > 0;
  }

  async getFoodLogs(userId: string): Promise<FoodLog[]> {
    return await db
      .select()
      .from(foodLogs)
      .where(eq(foodLogs.userId, userId))
      .orderBy(desc(foodLogs.createdAt));
  }

  async getFoodLogsByDate(userId: string, date: string): Promise<FoodLog[]> {
    const targetDate = new Date(date);
    const nextDate = new Date(targetDate);
    nextDate.setDate(nextDate.getDate() + 1);

    return await db
      .select()
      .from(foodLogs)
      .where(
        and(
          eq(foodLogs.userId, userId),
          gte(foodLogs.createdAt, targetDate),
          lt(foodLogs.createdAt, nextDate)
        )
      );
  }

  async createFoodLog(insertFoodLog: InsertFoodLog): Promise<FoodLog> {
    const [foodLog] = await db
      .insert(foodLogs)
      .values(insertFoodLog)
      .returning();
    return foodLog;
  }

  async deleteFoodLog(id: string): Promise<boolean> {
    const result = await db.delete(foodLogs).where(eq(foodLogs.id, id));
    return result.rowCount !== null && result.rowCount > 0;
  }

  async getWeightEntries(userId: string): Promise<WeightEntry[]> {
    return await db
      .select()
      .from(weightEntries)
      .where(eq(weightEntries.userId, userId))
      .orderBy(desc(weightEntries.createdAt));
  }

  async createWeightEntry(insertWeightEntry: InsertWeightEntry): Promise<WeightEntry> {
    const [weightEntry] = await db
      .insert(weightEntries)
      .values(insertWeightEntry)
      .returning();
    return weightEntry;
  }

  async deleteWeightEntry(id: string): Promise<boolean> {
    const result = await db.delete(weightEntries).where(eq(weightEntries.id, id));
    return result.rowCount !== null && result.rowCount > 0;
  }
}

export const storage = new DatabaseStorage();
