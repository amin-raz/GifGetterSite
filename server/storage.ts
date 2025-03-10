import { users, type User, type InsertUser, feedback, type Feedback, type InsertFeedback } from "@shared/schema";
import session from 'express-session';
import MemoryStore from 'memorystore';
import crypto from 'crypto';

const MemoryStoreSession = MemoryStore(session);

export interface IStorage {
  getUser(discordId: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  createFeedback(feedback: InsertFeedback): Promise<Feedback>;
  getFeedback(): Promise<Feedback[]>;
  sessionStore: session.Store;
}

// Temporary in-memory storage implementation until database is properly configured
export class MemStorage implements IStorage {
  private users: User[] = [];
  private feedbacks: Feedback[] = [];
  public sessionStore: session.Store;

  constructor() {
    this.sessionStore = new MemoryStoreSession({
      checkPeriod: 86400000 // prune expired entries every 24h
    });
  }

  async getUser(discordId: string): Promise<User | undefined> {
    return this.users.find(u => u.discordId === discordId);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const user: User = {
      id: crypto.randomUUID(),
      createdAt: new Date(),
      ...insertUser
    };
    this.users.push(user);
    return user;
  }

  async createFeedback(insertFeedback: InsertFeedback): Promise<Feedback> {
    const feedback: Feedback = {
      id: crypto.randomUUID(),
      createdAt: new Date(),
      ...insertFeedback
    };
    this.feedbacks.push(feedback);
    return feedback;
  }

  async getFeedback(): Promise<Feedback[]> {
    return this.feedbacks;
  }
}

export const storage = new MemStorage();