import { pgTable, text, serial, integer, boolean, timestamp, real } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Tabela de usuários
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email"),
  fullName: text("full_name"),
  role: text("role").default("user"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  lastLogin: timestamp("last_login"),
  isActive: boolean("is_active").default(true),
});

// Tabela de sinais de trading
export const signals = pgTable("signals", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  currencyPair: text("currency_pair").notNull(),
  direction: text("direction").notNull(), // "up" ou "down"
  entryTime: timestamp("entry_time").notNull(),
  expirationMinutes: integer("expiration_minutes").notNull(),
  result: text("result"), // "win", "loss" ou null (pendente)
  createdAt: timestamp("created_at").defaultNow().notNull(),
  winAmount: real("win_amount"),
});

// Tabela de estatísticas
export const statistics = pgTable("statistics", {
  id: serial("id").primaryKey(),
  totalSignals: integer("total_signals").default(0),
  winCount: integer("win_count").default(0),
  lossCount: integer("loss_count").default(0),
  dailyAverage: integer("daily_average").default(0),
  lastUpdated: timestamp("last_updated").defaultNow().notNull(),
});

// Tabela de depoimentos
export const testimonials = pgTable("testimonials", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  userName: text("user_name"),
  content: text("content").notNull(),
  rating: integer("rating").notNull(),
  isApproved: boolean("is_approved").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Schemas para inserção
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  email: true,
  fullName: true,
});

export const insertSignalSchema = createInsertSchema(signals).pick({
  userId: true,
  currencyPair: true,
  direction: true,
  entryTime: true,
  expirationMinutes: true,
});

export const insertTestimonialSchema = createInsertSchema(testimonials).pick({
  userId: true,
  userName: true,
  content: true,
  rating: true,
});

// Tipos TypeScript
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertSignal = z.infer<typeof insertSignalSchema>;
export type Signal = typeof signals.$inferSelect;

export type InsertTestimonial = z.infer<typeof insertTestimonialSchema>;
export type Testimonial = typeof testimonials.$inferSelect;

export type Statistic = typeof statistics.$inferSelect;
