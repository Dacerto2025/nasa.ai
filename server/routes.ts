import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertSignalSchema, insertTestimonialSchema, insertUserSchema } from "@shared/schema";
import { ZodError } from "zod";

// Middleware de validação usando schemas Zod
const validateRequest = (schema: typeof insertSignalSchema | typeof insertUserSchema | typeof insertTestimonialSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const validated = schema.parse(req.body);
      req.body = validated;
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({
          error: "Dados inválidos",
          details: error.errors,
        });
      } else {
        next(error);
      }
    }
  };
};

export async function registerRoutes(app: Express): Promise<Server> {
  // API para estatísticas
  app.get("/api/statistics", async (req: Request, res: Response) => {
    try {
      // Verificar se existe estatística, caso contrário criar
      let stats = await storage.getStatistics();
      
      if (!stats) {
        stats = await storage.updateStatistics();
      }
      
      res.json(stats);
    } catch (error) {
      console.error("Erro ao buscar estatísticas:", error);
      res.status(500).json({ error: "Erro ao buscar estatísticas" });
    }
  });
  
  // API para gerar sinais (simulação)
  app.post("/api/signals/generate", async (req: Request, res: Response) => {
    try {
      const { currencyPair, expirationMinutes } = req.body;
      
      if (!currencyPair || !expirationMinutes) {
        return res.status(400).json({ error: "Par de moedas e tempo de expiração são obrigatórios" });
      }
      
      // Na versão real, poderia implementar a lógica para gerar sinais baseados em algoritmos ou APIs externas
      // Aqui vamos apenas criar um sinal aleatório
      const direction = Math.random() > 0.5 ? "up" : "down";
      const entryTime = new Date();
      entryTime.setMinutes(entryTime.getMinutes() + 1); // Definir entrada para 1 minuto no futuro
      
      const signal = await storage.createSignal({
        userId: 1, // Usuário padrão (em um sistema real teríamos autenticação)
        currencyPair,
        direction,
        entryTime,
        expirationMinutes
      });
      
      res.status(201).json(signal);
    } catch (error) {
      console.error("Erro ao gerar sinal:", error);
      res.status(500).json({ error: "Erro ao gerar sinal" });
    }
  });
  
  // API para buscar sinais recentes
  app.get("/api/signals/recent", async (req: Request, res: Response) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
      const signals = await storage.getRecentSignals(limit);
      
      res.json(signals);
    } catch (error) {
      console.error("Erro ao buscar sinais recentes:", error);
      res.status(500).json({ error: "Erro ao buscar sinais recentes" });
    }
  });
  
  // API para atualizar resultado de um sinal
  app.patch("/api/signals/:id/result", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const { result, winAmount } = req.body;
      
      if (!id || !result || (result !== "win" && result !== "loss")) {
        return res.status(400).json({ error: "ID e resultado válido (win/loss) são obrigatórios" });
      }
      
      const updatedSignal = await storage.updateSignalResult(id, result, winAmount);
      
      if (!updatedSignal) {
        return res.status(404).json({ error: "Sinal não encontrado" });
      }
      
      res.json(updatedSignal);
    } catch (error) {
      console.error("Erro ao atualizar resultado do sinal:", error);
      res.status(500).json({ error: "Erro ao atualizar resultado do sinal" });
    }
  });
  
  // API para depoimentos
  app.get("/api/testimonials", async (req: Request, res: Response) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
      const testimonials = await storage.getApprovedTestimonials(limit);
      
      res.json(testimonials);
    } catch (error) {
      console.error("Erro ao buscar depoimentos:", error);
      res.status(500).json({ error: "Erro ao buscar depoimentos" });
    }
  });
  
  // API para adicionar um depoimento
  app.post("/api/testimonials", validateRequest(insertTestimonialSchema), async (req: Request, res: Response) => {
    try {
      const newTestimonial = await storage.createTestimonial(req.body);
      res.status(201).json(newTestimonial);
    } catch (error) {
      console.error("Erro ao criar depoimento:", error);
      res.status(500).json({ error: "Erro ao criar depoimento" });
    }
  });
  
  // API para aprovar um depoimento (poderia ter autenticação de admin em um sistema real)
  app.patch("/api/testimonials/:id/approve", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      
      if (!id) {
        return res.status(400).json({ error: "ID de depoimento inválido" });
      }
      
      const success = await storage.approveTestimonial(id);
      
      if (!success) {
        return res.status(404).json({ error: "Depoimento não encontrado" });
      }
      
      res.json({ success: true });
    } catch (error) {
      console.error("Erro ao aprovar depoimento:", error);
      res.status(500).json({ error: "Erro ao aprovar depoimento" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
