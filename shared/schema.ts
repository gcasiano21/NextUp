import { z } from "zod";


export type MediaItem = {
  id: string;
  title: string;
  type: "TV" | "Movie" | "Book" | "Music";
  creator: string;
  genre?: string | null;
  year?: number | null;
  dateAdded: string; 
};

export const insertMediaItemSchema = z.object({
  title: z.string().min(1),
  type: z.enum(["TV", "Movie", "Book", "Music"]),
  creator: z.string().min(1),
  genre: z.string().optional(),
  year: z.number().optional(),
});

export type InsertMediaItem = z.infer<typeof insertMediaItemSchema>;


export type User = {
  id: string;
  username: string;
  password: string;
};

export const insertUserSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
});

export type InsertUser = z.infer<typeof insertUserSchema>;
