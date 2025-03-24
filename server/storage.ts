import { 
  users, type User, type InsertUser,
  signals, type Signal, type InsertSignal,
  testimonials, type Testimonial, type InsertTestimonial,
  statistics, type Statistic
} from "@shared/schema";
import { eq, desc, count, avg, max, min, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/neon-serverless";
import { db } from "./db";

// Interface que define todos os métodos de acesso ao banco de dados
export interface IStorage {
  // Métodos de usuário
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserLastLogin(id: number): Promise<boolean>;
  
  // Métodos de sinais
  createSignal(signal: InsertSignal): Promise<Signal>;
  getSignalById(id: number): Promise<Signal | undefined>;
  getRecentSignals(limit?: number): Promise<Signal[]>;
  updateSignalResult(id: number, result: string, winAmount?: number): Promise<Signal | undefined>;
  getUserSignals(userId: number, limit?: number): Promise<Signal[]>;
  
  // Métodos de estatísticas
  getStatistics(): Promise<Statistic | undefined>;
  updateStatistics(): Promise<Statistic>;
  
  // Métodos de depoimentos
  createTestimonial(testimonial: InsertTestimonial): Promise<Testimonial>;
  getApprovedTestimonials(limit?: number): Promise<Testimonial[]>;
  approveTestimonial(id: number): Promise<boolean>;
}

// Implementação usando PostgreSQL
export class PostgresStorage implements IStorage {
  
  constructor() {
    // Verificar se temos acesso ao banco de dados
    if (!process.env.DATABASE_URL) {
      throw new Error("DATABASE_URL não está definido no ambiente");
    }
  }
  
  // USUÁRIOS
  
  async getUser(id: number): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
    return result[0];
  }
  
  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.username, username)).limit(1);
    return result[0];
  }
  
  async createUser(insertUser: InsertUser): Promise<User> {
    const result = await db.insert(users).values(insertUser).returning();
    return result[0];
  }
  
  async updateUserLastLogin(id: number): Promise<boolean> {
    const now = new Date();
    const result = await db
      .update(users)
      .set({ lastLogin: now })
      .where(eq(users.id, id))
      .returning();
    return result.length > 0;
  }
  
  // SINAIS
  
  async createSignal(signal: InsertSignal): Promise<Signal> {
    const result = await db.insert(signals).values(signal).returning();
    
    // Atualizar estatísticas
    await this.updateStatistics();
    
    return result[0];
  }
  
  async getSignalById(id: number): Promise<Signal | undefined> {
    const result = await db.select().from(signals).where(eq(signals.id, id)).limit(1);
    return result[0];
  }
  
  async getRecentSignals(limit: number = 10): Promise<Signal[]> {
    return await db
      .select()
      .from(signals)
      .orderBy(desc(signals.createdAt))
      .limit(limit);
  }
  
  async updateSignalResult(id: number, result: string, winAmount?: number): Promise<Signal | undefined> {
    const updateData: Partial<Signal> = { result };
    
    if (winAmount !== undefined) {
      updateData.winAmount = winAmount;
    }
    
    const updatedSignal = await db
      .update(signals)
      .set(updateData)
      .where(eq(signals.id, id))
      .returning();
    
    // Atualizar estatísticas
    await this.updateStatistics();
    
    return updatedSignal[0];
  }
  
  async getUserSignals(userId: number, limit: number = 50): Promise<Signal[]> {
    return await db
      .select()
      .from(signals)
      .where(eq(signals.userId, userId))
      .orderBy(desc(signals.createdAt))
      .limit(limit);
  }
  
  // ESTATÍSTICAS
  
  async getStatistics(): Promise<Statistic | undefined> {
    const result = await db.select().from(statistics).limit(1);
    return result[0];
  }
  
  async updateStatistics(): Promise<Statistic> {
    // Obter estatísticas atuais
    const totalSignals = await db.select({ count: count() }).from(signals);
    const winSignals = await db
      .select({ count: count() })
      .from(signals)
      .where(eq(signals.result, "win"));
    const lossSignals = await db
      .select({ count: count() })
      .from(signals)
      .where(eq(signals.result, "loss"));
    
    // Calcular média diária (últimos 30 dias)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const dailySignalsQuery = await db
      .select({ count: count() })
      .from(signals)
      .where(sql`${signals.createdAt} > ${thirtyDaysAgo}`);
    
    const dailyAverage = Math.ceil(dailySignalsQuery[0].count / 30);
    
    // Verificar se já existe estatística
    const existingStats = await this.getStatistics();
    
    if (existingStats) {
      // Atualizar
      const result = await db
        .update(statistics)
        .set({
          totalSignals: totalSignals[0].count,
          winCount: winSignals[0].count,
          lossCount: lossSignals[0].count,
          dailyAverage,
          lastUpdated: new Date()
        })
        .where(eq(statistics.id, existingStats.id))
        .returning();
      
      return result[0];
    } else {
      // Inserir
      const result = await db
        .insert(statistics)
        .values({
          totalSignals: totalSignals[0].count,
          winCount: winSignals[0].count,
          lossCount: lossSignals[0].count,
          dailyAverage,
          lastUpdated: new Date()
        })
        .returning();
      
      return result[0];
    }
  }
  
  // DEPOIMENTOS
  
  async createTestimonial(testimonial: InsertTestimonial): Promise<Testimonial> {
    const result = await db.insert(testimonials).values(testimonial).returning();
    return result[0];
  }
  
  async getApprovedTestimonials(limit: number = 10): Promise<Testimonial[]> {
    return await db
      .select()
      .from(testimonials)
      .where(eq(testimonials.isApproved, true))
      .orderBy(desc(testimonials.createdAt))
      .limit(limit);
  }
  
  async approveTestimonial(id: number): Promise<boolean> {
    const result = await db
      .update(testimonials)
      .set({ isApproved: true })
      .where(eq(testimonials.id, id))
      .returning();
    
    return result.length > 0;
  }
}

// Exportar uma instância do armazenamento para uso global
// MemStorage é mantido apenas para compatibilidade quando não há banco de dados disponível
export const storage = process.env.DATABASE_URL
  ? new PostgresStorage()
  : new class MemStorage implements IStorage {
      // Armazenamento em memória simplificado (implementação mínima obrigatória)
      private users = new Map<number, User>();
      private signals = new Map<number, Signal>();
      private testimonials = new Map<number, Testimonial>();
      private stats: Statistic | undefined;
      private currentIds = {
        users: 1,
        signals: 1,
        testimonials: 1,
        stats: 1
      };

      async getUser(id: number): Promise<User | undefined> {
        return this.users.get(id);
      }

      async getUserByUsername(username: string): Promise<User | undefined> {
        return Array.from(this.users.values()).find(u => u.username === username);
      }

      async createUser(insertUser: InsertUser): Promise<User> {
        const id = this.currentIds.users++;
        const now = new Date();
        const user = { ...insertUser, id, createdAt: now, isActive: true } as User;
        this.users.set(id, user);
        return user;
      }

      async updateUserLastLogin(id: number): Promise<boolean> {
        const user = this.users.get(id);
        if (!user) return false;
        user.lastLogin = new Date();
        this.users.set(id, user);
        return true;
      }

      // Métodos simplificados para sinais
      async createSignal(signal: InsertSignal): Promise<Signal> {
        const id = this.currentIds.signals++;
        const now = new Date();
        const newSignal = { ...signal, id, createdAt: now } as Signal;
        this.signals.set(id, newSignal);
        return newSignal;
      }

      async getSignalById(id: number): Promise<Signal | undefined> {
        return this.signals.get(id);
      }

      async getRecentSignals(limit: number = 10): Promise<Signal[]> {
        return Array.from(this.signals.values())
          .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
          .slice(0, limit);
      }

      async updateSignalResult(id: number, result: string, winAmount?: number): Promise<Signal | undefined> {
        const signal = this.signals.get(id);
        if (!signal) return undefined;
        
        signal.result = result;
        if (winAmount !== undefined) signal.winAmount = winAmount;
        
        this.signals.set(id, signal);
        return signal;
      }

      async getUserSignals(userId: number, limit: number = 50): Promise<Signal[]> {
        return Array.from(this.signals.values())
          .filter(s => s.userId === userId)
          .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
          .slice(0, limit);
      }

      // Métodos simplificados para estatísticas
      async getStatistics(): Promise<Statistic | undefined> {
        return this.stats;
      }

      async updateStatistics(): Promise<Statistic> {
        const totalSignals = this.signals.size;
        const winCount = Array.from(this.signals.values()).filter(s => s.result === "win").length;
        const lossCount = Array.from(this.signals.values()).filter(s => s.result === "loss").length;
        
        const now = new Date();
        const thirtyDaysAgo = new Date(now);
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        
        const recentSignals = Array.from(this.signals.values())
          .filter(s => s.createdAt > thirtyDaysAgo).length;
        
        const dailyAverage = Math.ceil(recentSignals / 30);
        
        this.stats = {
          id: 1,
          totalSignals,
          winCount,
          lossCount,
          dailyAverage,
          lastUpdated: now
        };
        
        return this.stats;
      }

      // Métodos simplificados para depoimentos
      async createTestimonial(testimonial: InsertTestimonial): Promise<Testimonial> {
        const id = this.currentIds.testimonials++;
        const now = new Date();
        const newTestimonial = { 
          ...testimonial, 
          id, 
          createdAt: now,
          isApproved: false
        } as Testimonial;
        
        this.testimonials.set(id, newTestimonial);
        return newTestimonial;
      }

      async getApprovedTestimonials(limit: number = 10): Promise<Testimonial[]> {
        return Array.from(this.testimonials.values())
          .filter(t => t.isApproved)
          .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
          .slice(0, limit);
      }

      async approveTestimonial(id: number): Promise<boolean> {
        const testimonial = this.testimonials.get(id);
        if (!testimonial) return false;
        
        testimonial.isApproved = true;
        this.testimonials.set(id, testimonial);
        return true;
      }
    }();
