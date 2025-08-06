import { sql } from "drizzle-orm";
import { 
  pgTable, text as pgText, varchar as pgVarchar, integer as pgInteger, 
  decimal as pgDecimal, timestamp as pgTimestamp, boolean as pgBoolean 
} from "drizzle-orm/pg-core";
import { 
  sqliteTable, text as sqliteText, integer as sqliteInteger, 
  real as sqliteReal, blob as sqliteBlob
} from "drizzle-orm/sqlite-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Determine database type from environment
const databaseUrl = process.env.DATABASE_URL || "sqlite:fitplan.db";
const isSqlite = databaseUrl.startsWith('sqlite:');

// Define tables based on database type
export const users = isSqlite 
  ? sqliteTable("users", {
      id: sqliteText("id").primaryKey(),
      username: sqliteText("username").notNull().unique(),
      email: sqliteText("email").notNull().unique(),
      password: sqliteText("password").notNull(),
      fullName: sqliteText("full_name"),
      age: sqliteInteger("age"),
      gender: sqliteText("gender"),
      currentWeight: sqliteReal("current_weight"),
      targetWeight: sqliteReal("target_weight"),
      primaryGoal: sqliteText("primary_goal"),
      activityLevel: sqliteText("activity_level"),
      weeklyWorkoutGoal: sqliteText("weekly_workout_goal"),
      createdAt: sqliteInteger("created_at", { mode: 'timestamp' }).default(sql`(unixepoch())`),
    })
  : pgTable("users", {
      id: pgVarchar("id").primaryKey().default(sql`gen_random_uuid()`),
      username: pgText("username").notNull().unique(),
      email: pgText("email").notNull().unique(),
      password: pgText("password").notNull(),
      fullName: pgText("full_name"),
      age: pgInteger("age"),
      gender: pgText("gender"),
      currentWeight: pgDecimal("current_weight", { precision: 5, scale: 2 }),
      targetWeight: pgDecimal("target_weight", { precision: 5, scale: 2 }),
      primaryGoal: pgText("primary_goal"),
      activityLevel: pgText("activity_level"),
      weeklyWorkoutGoal: pgText("weekly_workout_goal"),
      createdAt: pgTimestamp("created_at").defaultNow(),
    });

export const workouts = isSqlite
  ? sqliteTable("workouts", {
      id: sqliteText("id").primaryKey(),
      userId: sqliteText("user_id").notNull().references(() => users.id),
      workoutType: sqliteText("workout_type").notNull(),
      duration: sqliteInteger("duration").notNull(), // minutes
      caloriesBurned: sqliteInteger("calories_burned"),
      intensity: sqliteText("intensity"),
      exerciseDetails: sqliteText("exercise_details"),
      feeling: sqliteText("feeling"),
      createdAt: sqliteInteger("created_at", { mode: 'timestamp' }).default(sql`(unixepoch())`),
    })
  : pgTable("workouts", {
      id: pgVarchar("id").primaryKey().default(sql`gen_random_uuid()`),
      userId: pgVarchar("user_id").notNull().references(() => users.id),
      workoutType: pgText("workout_type").notNull(),
      duration: pgInteger("duration").notNull(), // minutes
      caloriesBurned: pgInteger("calories_burned"),
      intensity: pgText("intensity"),
      exerciseDetails: pgText("exercise_details"),
      feeling: pgText("feeling"),
      createdAt: pgTimestamp("created_at").defaultNow(),
    });

export const foodLogs = isSqlite
  ? sqliteTable("food_logs", {
      id: sqliteText("id").primaryKey(),
      userId: sqliteText("user_id").notNull().references(() => users.id),
      foodName: sqliteText("food_name").notNull(),
      servingSize: sqliteText("serving_size"),
      calories: sqliteInteger("calories").notNull(),
      protein: sqliteReal("protein"),
      carbs: sqliteReal("carbs"),
      fats: sqliteReal("fats"),
      mealType: sqliteText("meal_type").notNull(),
      createdAt: sqliteInteger("created_at", { mode: 'timestamp' }).default(sql`(unixepoch())`),
    })
  : pgTable("food_logs", {
      id: pgVarchar("id").primaryKey().default(sql`gen_random_uuid()`),
      userId: pgVarchar("user_id").notNull().references(() => users.id),
      foodName: pgText("food_name").notNull(),
      servingSize: pgText("serving_size"),
      calories: pgInteger("calories").notNull(),
      protein: pgDecimal("protein", { precision: 5, scale: 2 }),
      carbs: pgDecimal("carbs", { precision: 5, scale: 2 }),
      fats: pgDecimal("fats", { precision: 5, scale: 2 }),
      mealType: pgText("meal_type").notNull(),
      createdAt: pgTimestamp("created_at").defaultNow(),
    });

export const weightEntries = isSqlite
  ? sqliteTable("weight_entries", {
      id: sqliteText("id").primaryKey(),
      userId: sqliteText("user_id").notNull().references(() => users.id),
      weight: sqliteReal("weight").notNull(),
      notes: sqliteText("notes"),
      createdAt: sqliteInteger("created_at", { mode: 'timestamp' }).default(sql`(unixepoch())`),
    })
  : pgTable("weight_entries", {
      id: pgVarchar("id").primaryKey().default(sql`gen_random_uuid()`),
      userId: pgVarchar("user_id").notNull().references(() => users.id),
      weight: pgDecimal("weight", { precision: 5, scale: 2 }).notNull(),
      notes: pgText("notes"),
      createdAt: pgTimestamp("created_at").defaultNow(),
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
