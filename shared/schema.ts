import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, decimal, timestamp } from "drizzle-orm/pg-core";
import { sqliteTable, text as sqliteText, integer as sqliteInteger, real } from "drizzle-orm/sqlite-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Determine database type from environment
const isPostgreSQL = process.env.DATABASE_URL && 
                    !process.env.DATABASE_URL.includes('localhost') && 
                    !process.env.DATABASE_URL.startsWith('sqlite:');

// Create tables based on database type
export const users = isPostgreSQL ? pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  fullName: text("full_name"),
  age: integer("age"),
  gender: text("gender"),
  currentWeight: decimal("current_weight", { precision: 5, scale: 2 }),
  targetWeight: decimal("target_weight", { precision: 5, scale: 2 }),
  primaryGoal: text("primary_goal"),
  activityLevel: text("activity_level"),
  weeklyWorkoutGoal: text("weekly_workout_goal"),
  createdAt: timestamp("created_at").defaultNow(),
}) : sqliteTable("users", {
  id: sqliteText("id").primaryKey().default(sql`(hex(randomblob(16)))`),
  username: sqliteText("username").notNull().unique(),
  email: sqliteText("email").notNull().unique(),
  password: sqliteText("password").notNull(),
  fullName: sqliteText("full_name"),
  age: sqliteInteger("age"),
  gender: sqliteText("gender"),
  currentWeight: real("current_weight"),
  targetWeight: real("target_weight"),
  primaryGoal: sqliteText("primary_goal"),
  activityLevel: sqliteText("activity_level"),
  weeklyWorkoutGoal: sqliteText("weekly_workout_goal"),
  createdAt: sqliteInteger("created_at", { mode: 'timestamp' }).default(sql`(unixepoch())`),
});

export const workouts = isPostgreSQL ? pgTable("workouts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  workoutType: text("workout_type").notNull(),
  duration: integer("duration").notNull(),
  caloriesBurned: integer("calories_burned"),
  intensity: text("intensity"),
  exerciseDetails: text("exercise_details"),
  feeling: text("feeling"),
  createdAt: timestamp("created_at").defaultNow(),
}) : sqliteTable("workouts", {
  id: sqliteText("id").primaryKey().default(sql`(hex(randomblob(16)))`),
  userId: sqliteText("user_id").notNull().references(() => users.id),
  workoutType: sqliteText("workout_type").notNull(),
  duration: sqliteInteger("duration").notNull(),
  caloriesBurned: sqliteInteger("calories_burned"),
  intensity: sqliteText("intensity"),
  exerciseDetails: sqliteText("exercise_details"),
  feeling: sqliteText("feeling"),
  createdAt: sqliteInteger("created_at", { mode: 'timestamp' }).default(sql`(unixepoch())`),
});

export const foodLogs = isPostgreSQL ? pgTable("food_logs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  foodName: text("food_name").notNull(),
  servingSize: text("serving_size"),
  calories: integer("calories").notNull(),
  protein: decimal("protein", { precision: 5, scale: 2 }),
  carbs: decimal("carbs", { precision: 5, scale: 2 }),
  fats: decimal("fats", { precision: 5, scale: 2 }),
  mealType: text("meal_type").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
}) : sqliteTable("food_logs", {
  id: sqliteText("id").primaryKey().default(sql`(hex(randomblob(16)))`),
  userId: sqliteText("user_id").notNull().references(() => users.id),
  foodName: sqliteText("food_name").notNull(),
  servingSize: sqliteText("serving_size"),
  calories: sqliteInteger("calories").notNull(),
  protein: real("protein"),
  carbs: real("carbs"),
  fats: real("fats"),
  mealType: sqliteText("meal_type").notNull(),
  createdAt: sqliteInteger("created_at", { mode: 'timestamp' }).default(sql`(unixepoch())`),
});

export const weightEntries = isPostgreSQL ? pgTable("weight_entries", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  weight: decimal("weight", { precision: 5, scale: 2 }).notNull(),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
}) : sqliteTable("weight_entries", {
  id: sqliteText("id").primaryKey().default(sql`(hex(randomblob(16)))`),
  userId: sqliteText("user_id").notNull().references(() => users.id),
  weight: real("weight").notNull(),
  notes: sqliteText("notes"),
  createdAt: sqliteInteger("created_at", { mode: 'timestamp' }).default(sql`(unixepoch())`),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertWorkoutSchema = createInsertSchema(workouts).omit({
  id: true,
  createdAt: true,
});

export const insertFoodLogSchema = createInsertSchema(foodLogs).omit({
  id: true,
  createdAt: true,
});

export const insertWeightEntrySchema = createInsertSchema(weightEntries).omit({
  id: true,
  createdAt: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertWorkout = z.infer<typeof insertWorkoutSchema>;
export type Workout = typeof workouts.$inferSelect;
export type InsertFoodLog = z.infer<typeof insertFoodLogSchema>;
export type FoodLog = typeof foodLogs.$inferSelect;
export type InsertWeightEntry = z.infer<typeof insertWeightEntrySchema>;
export type WeightEntry = typeof weightEntries.$inferSelect;
