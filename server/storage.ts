import { type User, type InsertUser, type MediaItem, type InsertMediaItem } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  

  getAllMediaItems(): Promise<MediaItem[]>;
  getMediaItemsByType(type: string): Promise<MediaItem[]>;
  getMediaItemsByGenre(genre: string): Promise<MediaItem[]>;
  getRandomMediaItem(type?: string, genre?: string): Promise<MediaItem | undefined>;
  createMediaItem(mediaItem: InsertMediaItem): Promise<MediaItem>;
  updateMediaItem(id: string, mediaItem: Partial<InsertMediaItem>): Promise<MediaItem | undefined>;
  deleteMediaItem(id: string): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private mediaItems: Map<string, MediaItem>;

  constructor() {
    this.users = new Map();
    this.mediaItems = new Map();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }


  async getAllMediaItems(): Promise<MediaItem[]> {
    return Array.from(this.mediaItems.values());
  }

  async getMediaItemsByType(type: string): Promise<MediaItem[]> {
    return Array.from(this.mediaItems.values()).filter(
      item => item.type.toLowerCase() === type.toLowerCase()
    );
  }

  async getMediaItemsByGenre(genre: string): Promise<MediaItem[]> {
    return Array.from(this.mediaItems.values()).filter(
      item => item.genre?.toLowerCase().includes(genre.toLowerCase())
    );
  }

  async getRandomMediaItem(type?: string, genre?: string): Promise<MediaItem | undefined> {
    let items = Array.from(this.mediaItems.values());
    
    if (type) {
      items = items.filter(item => item.type.toLowerCase() === type.toLowerCase());
    }
    
    if (genre) {
      items = items.filter(item => item.genre?.toLowerCase().includes(genre.toLowerCase()));
    }
    
    if (items.length === 0) return undefined;
    
    const randomIndex = Math.floor(Math.random() * items.length);
    return items[randomIndex];
  }

  async createMediaItem(insertMediaItem: InsertMediaItem): Promise<MediaItem> {
    const id = randomUUID();
    const mediaItem: MediaItem = {
      ...insertMediaItem,
      id,
      creator: insertMediaItem.creator || null,
      genre: insertMediaItem.genre || null,
      year: insertMediaItem.year || null,
      dateAdded: new Date(),
    };
    this.mediaItems.set(id, mediaItem);
    return mediaItem;
  }

  async updateMediaItem(id: string, updateData: Partial<InsertMediaItem>): Promise<MediaItem | undefined> {
    const existing = this.mediaItems.get(id);
    if (!existing) return undefined;
    
    const updated: MediaItem = { ...existing, ...updateData };
    this.mediaItems.set(id, updated);
    return updated;
  }

  async deleteMediaItem(id: string): Promise<boolean> {
    return this.mediaItems.delete(id);
  }
}

export const storage = new MemStorage();
