import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertMediaItemSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  
  app.get("/api/media", async (req, res) => {
    try {
      const items = await storage.getAllMediaItems();
      res.json(items);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch media items" });
    }
  });

  
  app.get("/api/media/type/:type", async (req, res) => {
    try {
      const { type } = req.params;
      const items = await storage.getMediaItemsByType(type);
      res.json(items);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch media items by type" });
    }
  });

  
  app.get("/api/media/random", async (req, res) => {
    try {
      const { type, genre } = req.query;
      const item = await storage.getRandomMediaItem(
        type as string,
        genre as string
      );
      
      if (!item) {
        return res.status(404).json({ message: "No media items found matching criteria" });
      }
      
      res.json(item);
    } catch (error) {
      res.status(500).json({ message: "Failed to get random media item" });
    }
  });

  
  app.post("/api/media", async (req, res) => {
    try {
      const validatedData = insertMediaItemSchema.parse(req.body);
      const item = await storage.createMediaItem(validatedData);
      res.status(201).json(item);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Validation error", 
          errors: error.errors 
        });
      }
      res.status(500).json({ message: "Failed to create media item" });
    }
  });

  
  app.patch("/api/media/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const updateData = insertMediaItemSchema.partial().parse(req.body);
      const item = await storage.updateMediaItem(id, updateData);
      
      if (!item) {
        return res.status(404).json({ message: "Media item not found" });
      }
      
      res.json(item);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Validation error", 
          errors: error.errors 
        });
      }
      res.status(500).json({ message: "Failed to update media item" });
    }
  });


  app.delete("/api/media/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await storage.deleteMediaItem(id);
      
      if (!deleted) {
        return res.status(404).json({ message: "Media item not found" });
      }
      
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete media item" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
