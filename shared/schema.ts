import { z } from "zod";

export type Report = {
  MediaTitle: string;
  Issue: string;
  CorrectVersion?: string;
}

export type MediaItem = {
  id: string;
  title: string;
  type: "TV" | "Movie" | "Book" | "Music";
  creator: string;
  genre?: string | null;
  year?: number | null;
  dateAdded: string; 
};

export const insertReportSchema = z.object({
  MediaTitle: z.string().min(1, "Media Title is required"),
  Issue: z.string().min(1, "Issue description is required"),
  CorrectVersion: z.string().optional(),
});

export const insertMediaItemSchema = z.object({
  title: z.string().min(1),
  type: z.enum(["TV", "Movie", "Book", "Music"]),
  creator: z.string().min(1),
  genre: z.string().optional(),
  year: z.number().optional(),
});

export type InsertReportItem = z.infer<typeof insertReportSchema>;
export type InsertMediaItem = z.infer<typeof insertMediaItemSchema>;
